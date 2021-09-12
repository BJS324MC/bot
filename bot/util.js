function getUserGames(username, options={}) {
  let params = {
    nb: options.nb || 100,
    page: options.page || 1,
    with_analysis: options.with_analysis || 0,
    with_moves: options.with_moves || 0,
    with_opening: options.with_opening || 0,
    with_movetimes: options.with_movetimes || 0,
    rated: options.rated || 0
  };
  let queryString =
    'nb=' + params.nb +
    '&page=' + params.page +
    '&with_analysis=' + params.with_analysis +
    '&with_moves=' + params.with_moves +
    '&with_opening=' + params.with_opening +
    '&with_movetimes=' + params.with_movetimes +
    '&rated=' + params.rated;
  return fetch(api + '/games/user/' + username + '?' + queryString,get)
};
function setPos(fen,moves){
  console.log(fen,moves);
  chess.load(fen);
  for(let a of moves)chess.move(a,{sloppy:true});
  board.position(chess.fen())
}
const readStream = processLine => response => {
  const stream = response.body.getReader();
  const matcher = /\r?\n/;
  const decoder = new TextDecoder();
  let buf = '';

  const loop = () =>
    stream.read().then(({ done, value }) => {
      if (done) {
        if (buf.length > 0) processLine(JSON.parse(buf));
      } else {
        const chunk = decoder.decode(value, {
          stream: true
        });
        buf += chunk;

        const parts = buf.split(matcher);
        buf = parts.pop();
        for (const i of parts) processLine(JSON.parse(i));
        return loop();
      }
    });

  return loop();
}
function parsePgn2(pgn){
  let s1=pgn.split("\n\n");
  for(let i=0;i<s1.length-1;i++){
    let s2=s1[i].slice(s1[i].indexOf("White")+6),
    s3=s2.slice(0,s2.indexOf("]")),
    n=(s3==="\"Bjs324Chess\"" || s3==="\"BoayJS\"")?0:1;
    s1[i]=[n].concat(filterLine(s1[i+1]));
    s1.splice(i+1,1);
  }//
  if(s1[s1.length-1]==="\n")s1.pop();
  return s1
}
const parsePgn=pgn=>pgn.split("\n").filter(a=>a.charAt(0)==="1").map(filterLine);
const filterLine=line=>line.replace(/\d\./g,"").replace(/\n/g," ").split(" ").map(b=>b.trim()).filter(c=>isNaN(Number(c))).slice(0,-1);
function copy(e){var o=document.createElement("textarea");o.style.position="fixed",o.style.top=0,o.style.left=0,o.style.width="2em",o.style.height="2em",o.style.padding=0,o.style.border="none",o.style.outline="none",o.style.boxShadow="none",o.style.background="transparent",o.value=e,document.body.appendChild(o),o.focus(),o.select();try{var t=document.execCommand("copy")?"successful":"unsuccessful";console.log("Copying text command was "+t)}catch(e){console.log("Oops, unable to copy")}document.body.removeChild(o)}

function handleRandom(moves){//[0.333,0.666]//50:100 => 0.333:0.666
  let sum=0,sum2=0;
  for(let i in moves) sum+=moves[i]; sum*=Math.random();
  for (let i in moves) if((sum2+=moves[i])>sum)return i;
}
function createTable(parsed,table={}){
  parsed.forEach(line=>{
    let n=line[0];
    for(let i=1+n;i<line.length-1;i+=2){
      let part=line.slice(1,i);
      if (part in table) {
        if(line[i] in table[part])table[part][line[i]]++;
        else table[part][line[i]]=1;
      } else {
        table[part]={[line[i]]:1};
      }
    }
  })
  return table;
}
var data={};
function getData(url){
  fetch(url).then(f => f.text()).then(pgn => {
    createTable(parsePgn2(pgn),data);
  });
}
function clone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
}