import {test,expect} from '@playwright/test';

function pdfWithText(message){
 const escaped=message.replace(/[\\()]/g,'\\$&');
 const stream='BT /F1 11 Tf 40 730 Td ('+escaped+') Tj ET\n';
 const objs=[
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  '<< /Length '+Buffer.byteLength(stream)+' >>\nstream\n'+stream+'endstream'
 ];
 let s='%PDF-1.4\n', offsets=[0];
 for(let i=0;i<objs.length;i++){offsets.push(Buffer.byteLength(s));s+=(i+1)+' 0 obj\n'+objs[i]+'\nendobj\n';}
 const pos=Buffer.byteLength(s);
 s+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n';
 for(const off of offsets.slice(1))s+=String(off).padStart(10,'0')+' 00000 n \n';
 s+='trailer\n<< /Size '+(objs.length+1)+' /Root 1 0 R >>\nstartxref\n'+pos+'\n%%EOF';
 return Buffer.from(s);
}

test('PDF uploads, school scope, curricular source, paired annotations and reload',async({page})=>{
 await page.goto('http://127.0.0.1:8765/#cargar');
 await expect(page.locator('.brand-logo')).toHaveAttribute('src',/ijr\.edu\.co\/ijr\/img\/logo\.png/);
 await page.locator('#planTitle').fill('Cinemática y movimiento');
 await page.locator('#grade').selectOption('9');
 await page.locator('#group').selectOption('B');
 await page.locator('#area').selectOption('Física');
 await page.locator('#period').selectOption('III');
 await page.locator('#privacyCheck').check();
 const planning='Planeacion de clase. Grado 9. Docente de prueba. Objetivos de aprendizaje: describir movimiento. Actividades de aprendizaje: laboratorio y debate. Evaluacion formativa mediante rubrica y evidencias de aprendizaje. Secuencia didactica con recursos pedagogicos y materiales didacticos.';
 await page.locator('#pdfFile').setInputFiles({name:'planeacion.pdf',mimeType:'application/pdf',buffer:pdfWithText(planning)});
 await expect(page.locator('#fileStatus')).toContainText('Planeación académica probable',{timeout:15000});
 await page.locator('#uploadSubmit').click();
 await expect(page).toHaveURL(/#revision/,{timeout:15000});
 await expect(page.locator('main .title-row')).toContainText('9B');
 await expect(page.locator('#planDocument')).toHaveAttribute('translate','no');
 await page.locator('[data-source="malla"]').click();
 await expect(page.locator('#sourceContent')).toContainText('Sin malla institucional aportada');
 const malla='Malla curricular. Plan de area de Fisica. Grado 9. Periodo III. Ejes tematicos; estandares basicos de competencias y desempenos esperados. Objetivos y contenidos por periodo para el aprendizaje de cinematica, fuerzas y movimiento, con indicadores de logro y estrategias de evaluacion.';
 await page.locator('#mallaPdfFile').setInputFiles({name:'malla-fisica.pdf',mimeType:'application/pdf',buffer:pdfWithText(malla)});
 await expect(page.locator('#sourceContent')).toContainText('PDF aportado · pendiente de validación',{timeout:20000});
 await expect(page.locator('#sourceCanvas')).toBeVisible({timeout:15000});
 await page.locator('#sourceDocument').click({position:{x:90,y:90}});
 await expect(page.locator('#annotationDialog')).toBeVisible();
 await page.locator('#annotationText').fill('Contrastar el contenido de movimiento con los objetivos de aprendizaje.');
 await page.locator('#annotationForm .btn.primary').click();
 await expect(page.locator('#noteList')).toContainText('Malla curricular');
 await page.locator('[data-link-note="0"]').click();
 await page.locator('#planDocument').click({position:{x:90,y:90}});
 await expect(page.locator('#noteList')).toContainText('Planeación');
 await expect(page.locator('#planDocument .pin')).toHaveCount(1);
 await expect(page.locator('#sourceDocument .pin')).toHaveCount(1);
 await page.reload();
 await expect(page.locator('#noteList')).toContainText('Malla curricular',{timeout:15000});
 await page.locator('[data-source="malla"]').click();
 await expect(page.locator('#sourceContent')).toContainText('malla-fisica.pdf');
});
