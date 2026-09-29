const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,WidthType,BorderStyle,AlignmentType,Footer,PageNumber,HeadingLevel}=require('docx');
const d=JSON.parse(fs.readFileSync(process.argv[2]));
const summary=fs.readFileSync(process.argv[3],'utf8').trim().split('\n').filter(l=>l.trim());
const F='Urbanist', BODY=22, SMALL=18;
const para=(text,o={})=>new Paragraph({spacing:{after:o.after??160,line:o.line??264},alignment:o.align??AlignmentType.JUSTIFIED,children:runs(text,o)});
function runs(t,o={}){ // *italic* support
  return String(t).split(/(\*[^*]+\*)/).filter(Boolean).map(s=>{const it=/^\*.*\*$/.test(s);return new TextRun({text:it?s.slice(1,-1):s,italics:it||o.italics,bold:o.bold,size:o.size||BODY,font:F,color:o.color});});
}
const heading=(t,size)=>new Paragraph({spacing:{before:240,after:120},keepNext:true,children:[new TextRun({text:t,bold:true,size,font:F})]});
const bord={style:BorderStyle.SINGLE,size:4,color:'000000'};
const borders={top:bord,bottom:bord,left:bord,right:bord};
const cell=(paras,w,hdr)=>new TableCell({width:{size:w,type:WidthType.DXA},borders,margins:{top:60,bottom:60,left:100,right:100},children:paras});
const cp=(t,o={})=>new Paragraph({spacing:{after:o.after??60,line:240},keepLines:false,children:runs(t,{size:SMALL,...o})});
const arch=a=>a==='yuksek'?'strong':'weak';
const children=[];
children.push(new Paragraph({spacing:{after:80},children:[new TextRun({text:d.title,bold:true,size:30,font:F})]}));
children.push(para('Elif Bek',{after:240,align:AlignmentType.LEFT}));
children.push(heading('Abstract',24));
d.abstract.forEach(p=>children.push(para(p,{})));
children.push(para(d.fn,{size:16,after:240,align:AlignmentType.LEFT}));
children.push(heading('Literature Review',24));
children.push(para(d.methods,{}));
children.push(para(d.counts,{}));
const W=9070;
for(const g of d.groups){
  const hasPos=true;
  const cols=[2750,3000,1900,1420];
  const n=g.items.length;
  children.push(heading(`${g.head} (${n===1?'1 source':n+' sources'})`,22));
  const hdr=['Source','Relevance to this research'].concat(hasPos?['Positioning']:[]).concat(['Verified link']);
  const rows=[new TableRow({tableHeader:true,children:hdr.map((h,i)=>cell([cp(h,{bold:true,after:0})],cols[i]))})];
  for(const it of g.items){
    const c=[cell([cp(it.ref,{after:0})],cols[0])];
    const contrib=it.contrib+(it.pos?'':` Architectural approach: ${arch(it.arch)}.`);
    c.push(cell([cp(contrib,{after:0})],cols[1]));
    if(hasPos){
      const p=it.pos;
      const A='Architectural approach: '+arch(it.arch)[0].toUpperCase()+arch(it.arch).slice(1);
      c.push(cell(p?[cp('Field: '+p.field),cp(A),cp('Axis: '+p.axis),cp('Basis (verified wording): '+p.basis,{after:0})]:[cp('',{after:0})],cols[2]));
    }
    c.push(cell([cp(it.url||''),cp('Verified through: '+it.ver,{after:0,color:'555555'})],cols[cols.length-1]));
    rows.push(new TableRow({cantSplit:false,children:c}));
  }
  children.push(new Table({width:{size:W,type:WidthType.DXA},columnWidths:cols,rows}));
  children.push(para('',{after:120,align:AlignmentType.LEFT}));
}
children.push(heading(summary[0].trim(),24));
summary.slice(1).forEach(p=>children.push(para(p.trim(),{})));
const doc=new Document({creator:'Elif Bek',title:d.title,description:'',
 styles:{default:{document:{run:{font:F,size:BODY}}}},
 sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1418,bottom:1418,left:1418,right:1418}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({children:[PageNumber.CURRENT],font:F,size:18})]})]})},
  children}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(process.argv[4],b);console.log('written')});
