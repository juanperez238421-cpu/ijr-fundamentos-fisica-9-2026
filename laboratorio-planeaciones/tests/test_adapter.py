import importlib.util, unittest, json, threading
from pathlib import Path
from unittest.mock import patch
from urllib.request import Request,urlopen
from urllib.error import HTTPError
spec=importlib.util.spec_from_file_location('adapter',Path(__file__).parents[1]/'server/dev_server.py')
a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
class Validation(unittest.TestCase):
 def test_reject_empty_and_oversize(self):
  for pages in [[],[{'page':1,'text':''}],[{'page':1,'text':'a'*50001}]]:
   with self.assertRaises(ValueError):a.validate_input({'pages':pages})
 def test_reject_duplicate_page(self):
  with self.assertRaises(ValueError):a.validate_input({'pages':[{'page':1,'text':'x'},{'page':1,'text':'y'}]})
 def test_reject_invented_quote(self):
  with self.assertRaises(ValueError):a.validate_report({'findings':[{'title':'Test','detail':'test','source':'x','page':1,'quote':'inventada'}]},[{'page':1,'text':'texto real'}])
 def test_reject_invented_page(self):
  with self.assertRaises(ValueError):a.validate_report({'findings':[{'title':'Test','detail':'test','source':'x','page':3,'quote':'texto'}]},[{'page':1,'text':'texto real'}])
 def test_valid_quote_retains_page(self):
  r=a.validate_report({'findings':[{'title':'Test','detail':'test','source':'x','page':1,'quote':'texto real'}]},[{'page':1,'text':'texto real'}])
  self.assertEqual(r[0]['page'],1);self.assertIn('texto real',r[0]['detail']);self.assertEqual(r[0]['source'],a.SOURCE)
class HTTP(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.server=a.ThreadingHTTPServer(('127.0.0.1',0),a.Handler)
  threading.Thread(target=cls.server.serve_forever,daemon=True).start()
 @classmethod
 def tearDownClass(cls):cls.server.shutdown();cls.server.server_close()
 def request(self,origin='http://127.0.0.1:8765',obj=None):
  return urlopen(Request('http://127.0.0.1:'+str(self.server.server_port)+'/api/analyze',data=json.dumps(obj or {'pages':[{'page':1,'text':'Objetivo real'}]}).encode(),headers={'Host':'127.0.0.1:8765','Origin':origin,'Content-Type':'application/json'}))
 def test_foreign_origin_denied(self):
  with self.assertRaises(HTTPError) as e:self.request(origin='https://evil.example')
  self.assertEqual(e.exception.code,403)
 def test_valid_inference_with_mocked_ollama(self):
  import io
  output={'message':{'content':json.dumps({'findings':[{'title':'Objetivo','detail':'Verificar alineación','page':1,'source':'PEI','quote':'Objetivo real'}]})}}
  with patch.object(a,'urlopen',return_value=io.BytesIO(json.dumps(output).encode())):
   with self.request() as response: result=json.load(response)
  self.assertIn('Ollama local',result['engine']);self.assertEqual(len(result['findings']),1)
 def test_bad_request(self):
  with self.assertRaises(HTTPError) as e:self.request(obj={'pages':[]})
  self.assertEqual(e.exception.code,422)
if __name__=='__main__':unittest.main()
