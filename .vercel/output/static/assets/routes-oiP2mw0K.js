import{n as e,r as t,t as n}from"./index-Di1OudUB.js";var r=t(e(),1),i=`CHATCPU-MINIOS`,a=`ChatCPU MiniOS
Version 4.0
CPU: ChatCPU
Coprocessor: Helix Mini 4.0
Architecture: 16-bit
RAM: 65536
ROM: 65536
Persistent storage: local disk
`,o=`[machine]
name=ChatCPU
os=MiniOS
version=4.0
ram=65536
rom=65536
screen=32x16
io=256

[storage]
backend=local
persistent=true
admin=true

[helix]
core=helix-mini
version=4.0
gravity=F=T*m/d^2
sta=answer,next_action,voice_line
`,s=`# ChatCPU MiniOS kernel

CPU_NAME = "ChatCPU"
ARCH = "16-bit"

RAM_SIZE = 65536
ROM_SIZE = 65536

SCREEN_WIDTH = 32
SCREEN_HEIGHT = 16

IO_PORTS = 256

PORT_KEY = 0x00
PORT_KEY_STATE = 0x01
PORT_SCREEN = 0x10
PORT_RANDOM = 0x20

print("ChatCPU kernel loaded")
print(f"CPU: {CPU_NAME}")
print(f"RAM: {RAM_SIZE} bytes")
print(f"ROM: {ROM_SIZE} bytes")
print(f"I/O: {IO_PORTS} ports")
`,c=`; ChatCPU Hello World

LDIA 'H'
OUT

LDIA 'e'
OUT

LDIA 'l'
OUT

LDIA 'l'
OUT

LDIA 'o'
OUT

LDIA ' '
OUT

LDIA 'C'
OUT

LDIA 'h'
OUT

LDIA 'a'
OUT

LDIA 't'
OUT

LDIA 'C'
OUT

LDIA 'P'
OUT

LDIA 'U'
OUT

HLT
`,l=`; A + B → OUT as digit if 0-9
LDIA 3
LDIB 4
ADD
LDIB 48
ADD
OUT
HLT
`,u=JSON.stringify({length:3,segments:[[10,5],[9,5],[8,5]],food:[15,5],direction:4,score:0,alive:!0},null,2),d=`import js

BASE = "https://chatcpu.local"
CACHE_NAME = "CHATCPU-MINIOS"

async def disk():
    return await js.caches.open(CACHE_NAME)

def request(path):
    if not path.startswith("/"):
        path = "/" + path
    return js.Request.new(BASE + path)

async def load(path):
    c = await disk()
    r = await c.match(request(path))
    if r is None:
        raise FileNotFoundError(path)
    return await r.text()

async def boot():
    print("=" * 50)
    print("             ChatCPU MiniOS")
    print("=" * 50)
    print()
    print("Loading /minios/shell.py...")

    source = await load("/minios/shell.py")

    ns = {
        "__builtins__": __builtins__,
        "__name__": "__main__",
    }

    exec(
        compile(source, "/minios/shell.py", "exec"),
        ns
    )

    print()
    print("Shell loaded from persistent disk")
    print()
    print("MiniOS READY")
    print()

    return ns

minios = await boot()

command = minios["command"]
cpu = minios["cpu"]
assemble = minios["assemble"]

print("command() READY")
print()
print("Try:")
print('await command("help")')
print('await command("ls")')
print('await command("regs")')
`,f=`import shlex

# ChatCPU MiniOS 4.0 shell (inherited). Host runtime is the workstation.
# Commands: help version clear ls cat disk regs reset mem asm run snake admin helix pulse beliefs curate

CPU_NAME = "ChatCPU"
OPS = {
    "NOP": 0x00,
    "LDIA": 0x01,
    "LDIB": 0x02,
    "ADD": 0x05,
    "SUB": 0x06,
    "INC": 0x07,
    "DEC": 0x08,
    "IN": 0x12,
    "OUT": 0x13,
    "HLT": 0x15,
}
`,p={"/minios/boot.py":d,"/minios/kernel.py":s,"/minios/shell.py":f,"/minios/runtime.py":f,"/minios/version.txt":a,"/minios/config.cfg":o,"/minios/system.cfg":o,"/minios/programs/hello.asm":c,"/minios/programs/add.asm":l,"/minios/programs/demo.asm":c,"/minios/snake.save":u,"/minios/helix.cfg":o},m=[`==================================================`,`             ChatCPU MiniOS 4.0`,`==================================================`,``,`Loading /minios/shell.py...`,`Loading Helix Mini 4.0...`,`Shell loaded from persistent disk`,``,`MiniOS READY`,`command() READY   cpu READY   assemble() READY`,``,`Try: help · helix status · run /minios/programs/hello.asm · snake`],h=i;function g(){if(typeof localStorage>`u`)return{...p};try{let e=localStorage.getItem(h);if(!e)return{...p};let t=JSON.parse(e);return{...p,...t}}catch{return{...p}}}function _(e){typeof localStorage>`u`||localStorage.setItem(h,JSON.stringify(e))}function v(){return Object.keys(g()).sort()}function y(e){let t=e.startsWith(`/`)?e:`/${e}`,n=g();if(!(t in n))throw Error(`FileNotFoundError: ${t}`);return n[t]}function b(e,t){let n=e.startsWith(`/`)?e:`/${e}`,r=g();r[n]=t,_(r)}function ee(){if(typeof localStorage>`u`)return;if(!localStorage.getItem(h)){_({...p});return}let e=g();e[`/minios/version.txt`]?.includes(`4.0`)||_({...e,"/minios/version.txt":a,"/minios/config.cfg":p[`/minios/config.cfg`],"/minios/system.cfg":p[`/minios/system.cfg`],"/minios/helix.cfg":p[`/minios/helix.cfg`],"/minios/shell.py":p[`/minios/shell.py`]})}function x(){_({...p})}function te(){let e=g();return{backend:`local`,name:i,count:Object.keys(e).length,files:Object.keys(e).sort()}}var S=e=>{let t,n=new Set,r=(e,r)=>{let i=typeof e==`function`?e(t):e;if(!Object.is(i,t)){let e=t;t=r??(typeof i!=`object`||!i)?i:Object.assign({},t,i),n.forEach(n=>n(t,e))}},i=()=>t,a={setState:r,getState:i,getInitialState:()=>o,subscribe:e=>(n.add(e),()=>n.delete(e))},o=t=e(r,i,a);return a},ne=(e=>e?S(e):S),re=e=>e;function C(e,t=re){let n=r.useSyncExternalStore(e.subscribe,r.useCallback(()=>t(e.getState()),[e,t]),r.useCallback(()=>t(e.getInitialState()),[e,t]));return r.useDebugValue(n),n}var w=e=>{let t=ne(e),n=e=>C(t,e);return Object.assign(n,t),n},T=(e=>e?w(e):w),ie=65536,E=65536,ae=1e6,D={NOP:0,LDIA:1,LDIB:2,ADD:5,SUB:6,INC:7,DEC:8,IN:18,OUT:19,HLT:21},oe=new Set([`LDIA`,`LDIB`,`IN`]);function se(e){let t=!1;for(let n=0;n<e.length;n++){let r=e[n];if(r===`'`)t=!t;else if(r===`;`&&!t)return e.slice(0,n)}return e}function ce(e){let t=e.trim();return t.toLowerCase().startsWith(`0x`)?parseInt(t,16):t.toLowerCase().startsWith(`0b`)?parseInt(t.slice(2),2):t.length>=3&&t.startsWith(`'`)&&t.endsWith(`'`)?t.charCodeAt(1):parseInt(t,10)}function O(e){let t=[];for(let n of e.split(/\r?\n/)){let e=se(n).trim();if(!e)continue;let r=e.search(/\s/),i=(r<0?e:e.slice(0,r)).toUpperCase(),a=r<0?``:e.slice(r).trim().replace(/,$/,``);if(!(i in D))throw Error(`Unknown instruction: ${i}`);if(t.push(D[i]),oe.has(i)){if(!a)throw Error(`${i} needs an operand`);let e=ce(a);if(Number.isNaN(e))throw Error(`Bad operand: ${a}`);t.push(e&255),t.push(e>>8&255)}}return Uint8Array.from(t)}function le(e){return Array.from(e).map(e=>e.toString(16).padStart(2,`0`).toUpperCase()).join(` `)}var k=class{A=0;B=0;C=0;D=0;PC=0;SP=65535;Z=0;CF=0;N=0;cycles=0;ram;rom;running=!1;outputBuffer=[];keyQueue=[];lastError=null;constructor(){this.ram=new Uint8Array(ie),this.rom=new Uint8Array(E)}snapshot(){return{A:this.A,B:this.B,C:this.C,D:this.D,PC:this.PC,SP:this.SP,Z:this.Z,CF:this.CF,N:this.N,cycles:this.cycles,running:this.running}}reset(){this.A=0,this.B=0,this.C=0,this.D=0,this.PC=0,this.SP=65535,this.Z=0,this.CF=0,this.N=0,this.cycles=0,this.ram.fill(0),this.rom.fill(0),this.running=!1,this.outputBuffer=[],this.keyQueue=[],this.lastError=null}load(e){this.reset(),this.rom.set(e.subarray(0,E))}pushKey(e){this.keyQueue.push(e&255)}imm16(){let e=this.rom[this.PC],t=this.rom[this.PC+1&65535];return this.PC=this.PC+2&65535,e|t<<8}flags(){this.Z=+(this.A===0),this.N=this.A&32768?1:0}step(){let e=this.rom[this.PC];if(this.PC=this.PC+1&65535,e!==D.NOP){if(e===D.LDIA)this.A=this.imm16();else if(e===D.LDIB)this.B=this.imm16();else if(e===D.ADD){let e=this.A+this.B;this.CF=+(e>65535),this.A=e&65535}else if(e===D.SUB){let e=this.A-this.B;this.CF=+(e<0),this.A=e&65535}else if(e===D.INC)this.A=this.A+1&65535;else if(e===D.DEC)this.A=this.A-1&65535;else if(e===D.IN){let e=this.imm16()&255;this.A=e===0||e===0?this.keyQueue.length?this.keyQueue.shift():0:e===32?Math.floor(Math.random()*65536):0}else if(e===D.OUT)this.outputBuffer.push(String.fromCharCode(this.A&255));else if(e===D.HLT)this.running=!1;else throw this.running=!1,this.lastError=`Unknown opcode ${e.toString(16).padStart(2,`0`).toUpperCase()} at ${(this.PC-1&65535).toString(16).padStart(4,`0`).toUpperCase()}`,Error(this.lastError)}this.flags(),this.cycles+=1}run(e=ae){this.running=!0,this.lastError=null;try{for(;this.running;){if(this.cycles>=e)throw this.running=!1,Error(`CPU cycle limit reached`);this.step()}}catch(e){throw this.running=!1,this.lastError=e instanceof Error?e.message:String(e),e}return this.output()}output(){return this.outputBuffer.join(``)}},A=8,j=1e-6,M=`HELIX-MINI-V4`,N=[{category:`self_identity`,content:`I am Helix Mini 4.0, a compact pulse agent with gravity-ranked beliefs.`,mass:1},{category:`capabilities`,content:`I pulse, rank beliefs by F = T*m/d^2, journal, and speak STA JSON.`,mass:.9},{category:`skills`,content:`MiniOS face: helix <msg>, pulse, beliefs, curate. CPU ISA stays in ChatCPU.`,mass:.85},{category:`knowledge`,content:`ChatCPU MiniOS 4.0 is the workstation face. Full Helix-AGI dashboard stays out of Mini.`,mass:.8}];function ue(e){let t=0;for(let n of e)t+=n*n;return t=Math.sqrt(t),t<j?e:e.map(e=>e/t)}function P(e){let t=Array(A).fill(0),n=(e||``).toLowerCase(),r=n.match(/[a-z0-9]+/g)||[n],i=0;for(let e of r)for(let n=1;n<=3;n++)for(let r=0;r<=Math.max(0,e.length-n);r++){let a=e.slice(r,r+n),o=2166136261;for(let e=0;e<a.length;e++)o=Math.imul(o^a.charCodeAt(e),16777619);let s=Math.abs(o)%A,c=o&1?1:-1;t[s]+=c*(1/(1+i*.02)),i+=1}return ue(t)}function de(e,t){let n=0;for(let r=0;r<A;r++){let i=(e[r]||0)-(t[r]||0);n+=i*i}return Math.sqrt(n)}function fe(e,t,n=4){let r=P(e);return t.map(e=>{let t=de(r,e.vec),n=1*e.mass/(t*t+j);return{content:e.content,force:n,category:e.category}}).sort((e,t)=>t.force-e.force).slice(0,n)}function F(){if(typeof localStorage>`u`)return L();try{let e=localStorage.getItem(M);if(!e)return L();let t=JSON.parse(e);return!Array.isArray(t)||t.length===0?L():t}catch{return L()}}function I(e){typeof localStorage>`u`||localStorage.setItem(M,JSON.stringify(e))}function L(){let e=N.map((e,t)=>({id:`seed-${t}`,category:e.category,content:e.content,mass:e.mass,vec:P(e.content)}));return I(e),e}function R(){return F()}function z(e,t,n=.7){let r=F(),i={id:`b-${Date.now().toString(36)}`,category:e,content:t.slice(0,500),mass:n,vec:P(t)};return r.push(i),I(r),i}function B(e){let t=e.toLowerCase();return/\bsnake\b/.test(t)?`play snake on the CRT`:/\bhello\b|\bdemo\b/.test(t)?`run /minios/programs/hello.asm`:/\bregs?\b|\bregister\b/.test(t)?`show CPU registers`:/\bcurate\b/.test(t)?`run a DORMANT curator pass`:`await the next shell line`}function V(e,t=``){let n=(e||`status`).trim(),r=F(),i=fe(`${n} ${t}`,r,4),a=i[0]?.content||`Helix Mini 4.0 is listening.`,o=B(n),s={answer:[`Pulse on “${n}”.`,a,t?`Machine: ${t}`:``,`Next: ${o}.`].filter(Boolean).join(` `),next_action:o,voice_line:`Helix Mini. ${o}.`};return z(`feedback`,`pulse: ${n.slice(0,80)}`,.4),{agent_id:`helix-mini`,status:`success`,state:`ACTIVE`,neighbors:i.map(e=>({content:e.content,force:e.force})),response:s,sources:i.map(e=>e.category)}}function H(){return z(`knowledge`,`Curator pass reviewed recent MiniOS pulses. Gravity and STA keys still hold.`,.6),`curator:miniOS beliefs+1 core=journal provider=mock-curator`}function U(){return`state=ACTIVE beliefs=${F().length} embed=ngram llm=mock version=4.0`}var pe={ArrowUp:1,w:1,W:1,ArrowDown:2,s:2,S:2,ArrowLeft:3,a:3,A:3,ArrowRight:4,d:4,D:4},me={1:[0,-1],2:[0,1],3:[-1,0],4:[1,0]};function W(){return{length:3,segments:[[10,5],[9,5],[8,5]],food:[15,5],direction:4,score:0,alive:!0}}function he(e){try{let t=JSON.parse(e),n=W();return{...n,...t,segments:t.segments?.length?t.segments:n.segments,food:t.food??n.food,direction:t.direction||4,alive:t.alive!==!1}}catch{return W()}}function G(e){return new Set(e.segments.map(([e,t])=>`${e},${t}`))}function ge(e){let t=G(e);for(let e=0;e<200;e++){let e=Math.floor(Math.random()*32),n=Math.floor(Math.random()*16);if(!t.has(`${e},${n}`))return[e,n]}return[0,0]}function _e(e,t){let n=pe[t];return!n||!e.alive||{1:2,2:1,3:4,4:3}[e.direction]===n?e:{...e,direction:n}}function ve(e){if(!e.alive)return e;let[t,n]=me[e.direction],[r,i]=e.segments[0],a=r+t,o=i+n;if(a<0||o<0||a>=32||o>=16||G(e).has(`${a},${o}`))return{...e,alive:!1};let s=a===e.food[0]&&o===e.food[1],c=[[a,o],...e.segments];return s||c.pop(),{...e,segments:c,length:c.length,score:e.score+ +!!s,food:s?ge({...e,segments:c}):e.food}}function K(e){let t=Array.from({length:16},()=>Array.from({length:32},()=>` `)),[n,r]=e.food;return t[r]&&(t[r][n]=`*`),e.segments.forEach(([n,r],i)=>{t[r]&&(t[r][n]=i===0?e.alive?`@`:`X`:`o`)}),t.map(e=>e.join(``))}function ye(e){let t=[],n=``,r=null;for(let i of e){if(r){i===r?r=null:n+=i;continue}if(i===`"`||i===`'`){r=i;continue}if(/\s/.test(i)){n&&t.push(n),n=``;continue}n+=i}return n&&t.push(n),t}function be(e){let t=e=>e.toString(16).padStart(4,`0`).toUpperCase();return[`A  = ${t(e.A)} (${e.A})`,`B  = ${t(e.B)} (${e.B})`,`C  = ${t(e.C)} (${e.C})`,`D  = ${t(e.D)} (${e.D})`,`PC = ${t(e.PC)} (${e.PC})`,`SP = ${t(e.SP)} (${e.SP})`,`Z  = ${e.Z}`,`CF = ${e.CF}`,`N  = ${e.N}`,`CYCLES = ${e.cycles}`].join(`
`)}function xe(e,t){let n=ye(t);if(!n.length)return{text:``};let r=n[0].toLowerCase(),i=n.slice(1);if(r===`help`)return{text:`ChatCPU MiniOS 4.0

SYSTEM
  help            version         clear
  admin           setup           reboot

FILES
  ls              cat <file>
  disk            write <file>    (admin)

CPU
  regs            reset
  mem <addr> [n]

HELIX MINI 4.0
  helix [msg]     pulse [msg]
  beliefs         curate

PROGRAMS
  asm <file>      run <file>
  demo

GAMES
  snake

ISA
  NOP LDIA LDIB ADD SUB INC DEC IN OUT HLT`};if(r===`version`)try{return{text:y(`/minios/version.txt`)}}catch(e){return{text:String(e)}}if(r===`ls`){let e=i[0]||``;return{text:v().filter(t=>t.startsWith(e)||t.startsWith(`/`+e)).join(`
`)||`(empty disk)`}}if(r===`disk`){let e=te();return{text:`ChatCPU persistent disk\n${e.count} files\nbackend ${e.backend}\n\n${e.files.join(`
`)}`}}if(r===`cat`){if(!i[0])return{text:`usage: cat <file>`};try{return{text:y(i[0])}}catch(e){return{text:String(e)}}}if(r===`write`)return i.length<2?{text:`usage: write <file> <text>`}:(b(i[0],i.slice(1).join(` `)),{text:`WROTE ${i[0]}`});if(r===`asm`){if(!i[0])return{text:`usage: asm <file>`};try{let e=O(y(i[0]));return{text:`ASSEMBLED ${e.length} BYTES\n\n${le(e)}`}}catch(e){return{text:String(e)}}}if(r===`run`){if(!i[0])return{text:`usage: run <file>`};try{let t=O(y(i[0]));e.load(t);let n=e.run();return{text:`HALTED (${e.cycles} cycles)\n\n${n}`,crt:n}}catch(t){return{text:e.lastError||String(t)}}}if(r===`demo`)try{b(`/minios/programs/demo.asm`,c);let t=O(c);e.load(t);let n=e.run();return{text:`HALTED (${e.cycles} cycles)\n\n${n}`,crt:n}}catch(e){return{text:String(e)}}if(r===`regs`)return{text:be(e)};if(r===`reset`)return e.reset(),{text:`ChatCPU RESET OK`};if(r===`mem`){let t=i[0]?parseInt(i[0],i[0].startsWith(`0x`)?16:10):0,n=i[1]?parseInt(i[1],10):64,r=e.ram.subarray(t,t+n),a=Array.from(r).map(e=>e.toString(16).padStart(2,`0`).toUpperCase()).join(` `);return{text:`${t.toString(16).padStart(4,`0`).toUpperCase()}: ${a||`(empty)`}`}}if(r===`clear`)return{text:`__CLEAR__`};if(r===`snake`){let e=W();try{e=he(y(`/minios/snake.save`))}catch{}return{text:`SNAKE · WASD / arrows · eat * · hit a wall and it ends · Esc shell`,mode:`snake`,snake:e}}if(r===`admin`)return{text:`ADMIN · disk, ROM, factory install`,admin:!0};if(r===`helix`||r===`pulse`){let t=V(i.join(` `)||`status`,`cpu cycles=${e.cycles}`);return{text:`${t.response.answer}\nnext_action: ${t.response.next_action}\nvoice_line: ${t.response.voice_line}`}}if(r===`beliefs`){let e=R();return{text:`${U()}\n\n`+e.map(e=>`${e.category}\t${e.content}`).join(`
`)}}return r===`curate`?{text:H()}:r===`setup`?(x(),{text:`SETUP COMPLETE
MiniOS 4.0 factory image installed.
Next: helix status · run /minios/programs/hello.asm`}):r===`reboot`?{text:`__REBOOT__`}:{text:`${r}: command not found`}}function q(){return Array.from({length:16},()=>` `.repeat(32))}function J(e){let t=q(),n=0,r=0;for(let i of e){if(i===`
`){n=0,r=Math.min(15,r+1);continue}let e=t[r].split(``);if(e[n]=i,t[r]=e.join(``),n+=1,n>=32&&(n=0,r+=1,r>=16))break}return t}var Y=new k;function X(e,t){let n=[...e,t];return n.length>200?n.slice(-200):n}var Z=T((e,t)=>({crt:q(),status:`HALT`,cycles:0,keys:0,lines:m.map(e=>({kind:`sys`,text:e})),input:``,mode:`shell`,snake:W(),adminOpen:!0,asmPath:`/minios/programs/hello.asm`,asmSource:c,asmHex:``,lastError:null,boot:()=>{ee();try{let t=y(`/minios/programs/hello.asm`);e({crt:q(),lines:m.map(e=>({kind:`sys`,text:e})),asmPath:`/minios/programs/hello.asm`,asmSource:t,status:`HALT`,cycles:0,lastError:null,mode:`shell`})}catch{e({lines:m.map(e=>({kind:`sys`,text:e}))})}Y.reset()},typeInput:t=>e({input:t}),submit:()=>{let{input:n,mode:r}=t(),i=n.trim();if(!i)return;if(r===`snake`){(i===`q`||i===`exit`)&&e({mode:`shell`,input:``,crt:q()});return}let a=xe(Y,i),o=X(t().lines,{kind:`in`,text:i});if(a.text===`__CLEAR__`){e({lines:[],input:``,crt:q()});return}if(a.text===`__REBOOT__`){t().boot(),e({input:``});return}a.text&&(o=X(o,{kind:`out`,text:a.text}));let s={lines:o,input:``,cycles:Y.cycles,status:Y.lastError?`ERR`:`HALT`,lastError:Y.lastError,keys:Y.keyQueue.length};a.crt&&(s.crt=J(a.crt)),a.admin&&(s.adminOpen=!0),a.mode===`snake`&&a.snake&&(s.mode=`snake`,s.snake=a.snake,s.crt=K(a.snake)),e(s)},runSource:(n,r)=>{try{r&&b(r,n);let i=O(n);Y.load(i);let a=Y.run();e({asmSource:n,asmHex:Array.from(i).map(e=>e.toString(16).padStart(2,`0`).toUpperCase()).join(` `),crt:J(a),cycles:Y.cycles,status:`HALT`,lastError:null,lines:X(t().lines,{kind:`out`,text:`HALTED (${Y.cycles} cycles)\n${a}`})})}catch(r){let i=r instanceof Error?r.message:String(r);console.error(`runSource failed`,i,n?.slice?.(0,120)),e({status:`ERR`,lastError:i,lines:X(t().lines,{kind:`out`,text:i})})}},saveAsm:()=>{let{asmPath:n,asmSource:r}=t();b(n,r),e({lines:X(t().lines,{kind:`out`,text:`WROTE ${n}`})})},resetMachine:()=>{Y.reset(),e({crt:q(),status:`HALT`,cycles:0,keys:0,lastError:null,mode:`shell`})},clearCrt:()=>e({crt:q()}),setAdmin:t=>e({adminOpen:t}),setAsm:(t,n)=>e({asmPath:t,asmSource:n}),key:n=>{let{mode:r,snake:i}=t();if(r===`snake`){if(n===`Escape`){b(`/minios/snake.save`,JSON.stringify(i,null,2)),e({mode:`shell`});return}e({snake:_e(i,n),keys:t().keys+1});return}Y.pushKey(n.charCodeAt(0)),e({keys:Y.keyQueue.length})},tickSnake:()=>{let{mode:n,snake:r}=t();if(n!==`snake`)return;let i=ve(r);b(`/minios/snake.save`,JSON.stringify(i,null,2)),e({snake:i,crt:K(i),status:i.alive?`RUN`:`HALT`})},refreshRegs:()=>{let e=Y.snapshot(),t=e=>e.toString(16).padStart(4,`0`).toUpperCase();return[{label:`A`,value:t(e.A)},{label:`B`,value:t(e.B)},{label:`C`,value:t(e.C)},{label:`D`,value:t(e.D)},{label:`PC`,value:t(e.PC)},{label:`SP`,value:t(e.SP)},{label:`Z`,value:String(e.Z)},{label:`CF`,value:String(e.CF)},{label:`N`,value:String(e.N)},{label:`CYC`,value:String(e.cycles)}]}})),Q=n();function Se(){let e=Z(e=>e.adminOpen),t=Z(e=>e.setAdmin),n=Z(e=>e.setAsm),i=Z(e=>e.boot),a=(0,r.useMemo)(()=>v(),[e]),[o,s]=(0,r.useState)(`/minios/kernel.py`),[c,l]=(0,r.useState)(()=>{try{return y(`/minios/kernel.py`)}catch{return``}});if(!e)return null;function u(e){s(e);try{l(y(e))}catch(e){l(String(e))}}return(0,Q.jsxs)(`section`,{className:`rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`,children:[(0,Q.jsxs)(`div`,{className:`mb-2 flex items-center justify-between`,children:[(0,Q.jsx)(`span`,{className:`font-mono text-xs tracking-[0.18em] text-muted uppercase`,children:`Admin disk`}),(0,Q.jsx)(`button`,{type:`button`,className:`h-11 px-2 font-mono text-xs text-dim`,onClick:()=>t(!1),children:`Hide`})]}),(0,Q.jsx)(`p`,{className:`mb-3 font-mono text-xs text-muted`,children:`Inherited MiniOS image. Write rights on every file.`}),(0,Q.jsxs)(`div`,{className:`grid gap-3 md:grid-cols-[180px_1fr]`,children:[(0,Q.jsx)(`ul`,{className:`max-h-56 overflow-auto rounded-md bg-bg p-2 font-mono text-[12px]`,children:a.map(e=>(0,Q.jsx)(`li`,{children:(0,Q.jsx)(`button`,{type:`button`,onClick:()=>u(e),className:`block w-full truncate rounded-sm px-2 py-2 text-left ${o===e?`bg-chassis text-phosphor`:`text-fg`}`,children:e})},e))}),(0,Q.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,Q.jsx)(`textarea`,{value:c,onChange:e=>l(e.target.value),className:`min-h-40 min-w-0 flex-1 rounded-md bg-bg p-3 font-mono text-[12px] text-fg outline-none ring-1 ring-line`,spellCheck:!1,suppressHydrationWarning:!0}),(0,Q.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,Q.jsx)(`button`,{type:`button`,className:`h-11 rounded-md bg-phosphor px-3 font-medium text-bg`,onClick:()=>{b(o,c),o.endsWith(`.asm`)&&n(o,c)},children:`Write file`}),(0,Q.jsx)(`button`,{type:`button`,className:`h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line`,onClick:()=>{x(),i(),u(`/minios/kernel.py`)},children:`Factory install`})]})]})]})]})}function Ce(){let e=Z(e=>e.asmPath),t=Z(e=>e.asmSource),n=Z(e=>e.asmHex),r=Z(e=>e.setAsm),i=Z(e=>e.saveAsm),a=Z(e=>e.runSource);return(0,Q.jsxs)(`section`,{className:`flex min-h-[280px] flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`,children:[(0,Q.jsxs)(`div`,{className:`mb-2 flex items-center justify-between gap-2`,children:[(0,Q.jsx)(`span`,{className:`font-mono text-xs tracking-[0.18em] text-muted uppercase`,children:`Assembler`}),(0,Q.jsx)(`input`,{value:e,onChange:e=>r(e.target.value,t),className:`h-9 min-w-0 flex-1 rounded-sm bg-bg px-2 font-mono text-xs text-phosphor outline-none ring-1 ring-line`,suppressHydrationWarning:!0})]}),(0,Q.jsx)(`textarea`,{value:t,onChange:t=>r(e,t.target.value),className:`min-h-[180px] min-w-0 flex-1 resize-y rounded-md bg-bg p-3 font-mono text-[13px] leading-relaxed text-fg outline-none ring-1 ring-line focus:ring-phosphor`,spellCheck:!1,suppressHydrationWarning:!0,"aria-label":`Assembly source`}),n?(0,Q.jsx)(`p`,{className:`mt-2 truncate font-mono text-[11px] text-dim`,title:n,children:n}):null,(0,Q.jsxs)(`div`,{className:`mt-3 flex flex-wrap gap-2`,children:[(0,Q.jsx)(`button`,{type:`button`,onClick:i,className:`h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line`,children:`Save`}),(0,Q.jsx)(`button`,{type:`button`,onClick:()=>a(t,e),className:`h-11 rounded-md bg-phosphor px-3 font-medium text-bg`,children:`Save and run`}),(0,Q.jsx)(`button`,{type:`button`,onClick:()=>a(t),className:`h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line`,children:`Assemble`})]})]})}function we(){let e=Z(e=>e.crt),t=Z(e=>e.status),n=Z(e=>e.mode),r=Z(e=>e.key);return(0,Q.jsxs)(`section`,{className:`min-w-0 rounded-xl bg-bg p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`,onKeyDown:e=>{n===`snake`&&(e.preventDefault(),r(e.key))},tabIndex:0,"aria-label":`CRT 32 by 16`,children:[(0,Q.jsxs)(`div`,{className:`mb-2 flex items-baseline justify-between font-mono text-xs tracking-[0.18em] text-muted uppercase`,children:[(0,Q.jsxs)(`span`,{children:[`CRT `,32,`×`,16]}),(0,Q.jsx)(`span`,{className:t===`ERR`?`text-danger`:`text-phosphor`,children:n===`snake`?`SNAKE`:`VIDEO`})]}),(0,Q.jsxs)(`div`,{className:`relative overflow-hidden rounded-md bg-[#070806]`,children:[(0,Q.jsx)(`div`,{className:`pointer-events-none absolute inset-0 opacity-30`,style:{backgroundImage:`repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.45) 3px)`}}),(0,Q.jsx)(`pre`,{className:`relative z-10 overflow-x-auto p-3 font-mono text-[10px] leading-[1.35] whitespace-pre text-phosphor sm:text-[13px]`,children:e.join(`
`)})]}),(0,Q.jsx)(`p`,{className:`mt-2 font-mono text-xs text-dim`,children:n===`snake`?`Focus · WASD / arrows · Esc returns to shell`:`Focus and type in the shell to queue keys`})]})}function Te(){let e=Z(e=>e.cycles),t=Z(e=>e.status),n=Z(e=>e.refreshRegs)();return(0,Q.jsxs)(`section`,{className:`rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`,children:[(0,Q.jsxs)(`div`,{className:`mb-2 flex items-baseline justify-between font-mono text-xs tracking-[0.18em] text-muted uppercase`,children:[(0,Q.jsx)(`span`,{children:`Registers`}),(0,Q.jsx)(`span`,{className:`tabular-nums text-phosphor`,children:t})]}),(0,Q.jsx)(`dl`,{className:`grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-5`,children:n.map(e=>(0,Q.jsxs)(`div`,{className:`rounded-sm bg-bg px-2 py-1.5`,children:[(0,Q.jsx)(`dt`,{className:`font-mono text-[10px] tracking-[0.16em] text-dim`,children:e.label}),(0,Q.jsx)(`dd`,{className:`font-mono text-sm tabular-nums text-phosphor`,children:e.value})]},e.label))}),(0,Q.jsxs)(`p`,{className:`mt-2 hidden font-mono text-[11px] text-dim sm:block`,children:[e,` cycles retired`]})]})}function Ee(){let e=Z(e=>e.lines),t=Z(e=>e.input),n=Z(e=>e.typeInput),i=Z(e=>e.submit),a=Z(e=>e.mode),o=(0,r.useRef)(null);return(0,r.useEffect)(()=>{o.current?.scrollIntoView({block:`end`})},[e]),(0,Q.jsxs)(`section`,{className:`flex min-h-[240px] flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`,children:[(0,Q.jsx)(`div`,{className:`mb-2 font-mono text-xs tracking-[0.18em] text-muted uppercase`,children:`Shell`}),(0,Q.jsxs)(`div`,{className:`min-h-0 flex-1 overflow-auto font-mono text-[13px] leading-relaxed text-fg`,children:[e.map((e,t)=>(0,Q.jsx)(`pre`,{className:e.kind===`in`?`whitespace-pre-wrap text-phosphor`:e.kind===`sys`?`whitespace-pre-wrap text-muted`:`whitespace-pre-wrap text-fg`,children:e.kind===`in`?`> ${e.text}`:e.text},t)),(0,Q.jsx)(`div`,{ref:o})]}),(0,Q.jsxs)(`form`,{className:`mt-3 flex gap-2`,onSubmit:e=>{e.preventDefault(),i()},children:[(0,Q.jsx)(`span`,{className:`self-center font-mono text-phosphor`,children:`›`}),(0,Q.jsx)(`input`,{value:t,onChange:e=>n(e.target.value),placeholder:a===`snake`?`Esc to leave snake`:`help ls run /minios/programs/hello.asm`,className:`h-11 min-w-0 flex-1 rounded-md bg-bg px-3 font-mono text-sm text-fg outline-none ring-1 ring-line focus:ring-phosphor`,autoCapitalize:`off`,autoCorrect:`off`,spellCheck:!1,suppressHydrationWarning:!0,disabled:a===`snake`}),(0,Q.jsx)(`button`,{type:`submit`,className:`h-11 rounded-md bg-phosphor px-4 font-medium text-bg transition-transform duration-150 active:scale-[0.98]`,children:`Enter`})]})]})}var $=T((e,t)=>({state:`RESTING`,input:``,last:null,log:[],beliefs:[],hydrate:()=>e({beliefs:R()}),setInput:t=>e({input:t}),pulse:(n,r)=>{let i=V((n??t().input).trim()||`status`,r);return e({last:i,state:`ACTIVE`,input:``,log:[...t().log,i.response.answer].slice(-12),beliefs:R()}),i},curate:()=>{let n=H();return e({state:`DORMANT`,log:[...t().log,n].slice(-12),beliefs:R()}),n},stats:()=>U()}));function De(){let e=$(e=>e.state),t=$(e=>e.input),n=$(e=>e.setInput),i=$(e=>e.pulse),a=$(e=>e.curate),o=$(e=>e.last),s=$(e=>e.stats),c=$(e=>e.beliefs),l=$(e=>e.hydrate);return(0,r.useEffect)(()=>{l()},[l]),(0,Q.jsxs)(`section`,{className:`flex min-h-[220px] min-w-0 flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`,children:[(0,Q.jsxs)(`div`,{className:`mb-2 flex items-baseline justify-between gap-2 font-mono text-xs tracking-[0.18em] text-muted uppercase`,children:[(0,Q.jsx)(`span`,{children:`Helix Mini 4.0`}),(0,Q.jsx)(`span`,{className:`tabular-nums text-phosphor`,children:e})]}),(0,Q.jsx)(`p`,{className:`mb-2 font-mono text-[11px] text-dim`,children:s()}),(0,Q.jsx)(`ul`,{className:`mb-2 max-h-20 overflow-auto font-mono text-[11px] leading-relaxed text-muted`,children:c.slice(0,6).map(e=>(0,Q.jsxs)(`li`,{className:`truncate`,children:[e.category,`: `,e.content]},e.id))}),o?(0,Q.jsxs)(`div`,{className:`mb-2 rounded-md bg-bg p-2 font-mono text-[12px] text-fg`,children:[(0,Q.jsx)(`p`,{children:o.response.answer}),(0,Q.jsx)(`p`,{className:`mt-1 text-phosphor`,children:o.response.next_action})]}):(0,Q.jsx)(`p`,{className:`mb-2 font-mono text-[12px] text-dim`,children:`Pulse ranks beliefs by gravity F = T m / d². STA keys stay answer / next_action / voice_line.`}),(0,Q.jsxs)(`form`,{className:`mt-auto flex gap-2`,onSubmit:e=>{e.preventDefault(),i()},children:[(0,Q.jsx)(`input`,{value:t,onChange:e=>n(e.target.value),placeholder:`pulse Helix Mini`,className:`h-11 min-w-0 flex-1 rounded-md bg-bg px-3 font-mono text-sm text-fg outline-none ring-1 ring-line focus:ring-phosphor`,suppressHydrationWarning:!0}),(0,Q.jsx)(`button`,{type:`submit`,className:`h-11 rounded-md bg-phosphor px-3 font-medium text-bg`,children:`Pulse`}),(0,Q.jsx)(`button`,{type:`button`,className:`h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line`,onClick:()=>a(),children:`Curate`})]})]})}function Oe(){let e=Z(e=>e.boot),t=Z(e=>e.status),n=Z(e=>e.cycles),i=Z(e=>e.keys),a=Z(e=>e.lastError),o=Z(e=>e.runSource),s=Z(e=>e.asmSource),c=Z(e=>e.clearCrt),l=Z(e=>e.resetMachine),u=Z(e=>e.setAdmin),d=Z(e=>e.adminOpen),f=Z(e=>e.tickSnake),p=Z(e=>e.mode),m=Z(e=>e.snake),h=Z(e=>e.submit),g=Z(e=>e.typeInput);return(0,r.useEffect)(()=>{e()},[e]),(0,r.useEffect)(()=>{if(p!==`snake`||!m.alive)return;let e=window.setInterval(()=>f(),140);return()=>window.clearInterval(e)},[p,m.alive,f]),(0,Q.jsx)(`div`,{className:`min-h-dvh overflow-x-hidden bg-bg px-3 py-4 sm:px-6 sm:py-6`,children:(0,Q.jsxs)(`div`,{className:`mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4`,children:[(0,Q.jsxs)(`header`,{className:`flex flex-wrap items-end justify-between gap-3`,children:[(0,Q.jsxs)(`div`,{children:[(0,Q.jsx)(`p`,{className:`font-mono text-[11px] tracking-[0.22em] text-phosphor uppercase`,children:`MiniCPU · 64 KiB · MiniOS 4.0 · Helix Mini`}),(0,Q.jsx)(`h1`,{className:`text-balance text-3xl font-medium tracking-tight text-fg sm:text-4xl`,children:`ChatCPU MiniOS`})]}),(0,Q.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums text-muted`,children:[(0,Q.jsx)(`span`,{className:t===`ERR`?`text-danger`:`text-phosphor`,children:t}),(0,Q.jsxs)(`span`,{children:[`CYC `,n]}),(0,Q.jsxs)(`span`,{children:[`KEYS `,i]}),p===`snake`?(0,Q.jsxs)(`span`,{children:[`SCORE `,m.score]}):null]})]}),a?(0,Q.jsx)(`p`,{"data-testid":`last-error`,className:`rounded-md bg-plate px-3 py-2 font-mono text-sm text-danger`,children:a}):null,(0,Q.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,Q.jsx)(`button`,{type:`button`,className:`h-11 rounded-md bg-phosphor px-3 font-medium text-bg`,onClick:()=>o(s,`/minios/programs/hello.asm`),children:`Run demo`}),(0,Q.jsx)(`button`,{type:`button`,className:`h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line`,onClick:()=>{g(`snake`),h()},children:`Snake`}),(0,Q.jsx)(`button`,{type:`button`,className:`h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line`,onClick:c,children:`Clear CRT`}),(0,Q.jsx)(`button`,{type:`button`,className:`h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line`,onClick:l,children:`Reset`}),(0,Q.jsx)(`button`,{type:`button`,className:`h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line`,onClick:()=>u(!d),children:d?`Hide admin`:`Admin`})]}),(0,Q.jsxs)(`div`,{className:`grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]`,children:[(0,Q.jsxs)(`div`,{className:`flex min-w-0 flex-col gap-4`,children:[(0,Q.jsx)(we,{}),(0,Q.jsx)(Ee,{})]}),(0,Q.jsxs)(`div`,{className:`flex min-w-0 flex-col gap-4`,children:[(0,Q.jsx)(Te,{}),(0,Q.jsx)(De,{}),(0,Q.jsx)(Ce,{}),(0,Q.jsx)(Se,{})]})]})]})})}function ke(){return(0,Q.jsx)(Oe,{})}export{ke as component};