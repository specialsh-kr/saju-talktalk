const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const STORE = 'todaygyeol.v2.profile';

const ELS = {甲:'목',乙:'목',丙:'화',丁:'화',戊:'토',己:'토',庚:'금',辛:'금',壬:'수',癸:'수',子:'수',丑:'토',寅:'목',卯:'목',辰:'토',巳:'화',午:'화',未:'토',申:'금',酉:'금',戌:'토',亥:'수'};
const GEN = {목:'화',화:'토',토:'금',금:'수',수:'목'};
const CTRL = {목:'토',토:'수',수:'화',화:'금',금:'목'};

const GAN_KO={甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',己:'기',庚:'경',辛:'신',壬:'임',癸:'계'};
const ZHI_KO={子:'자',丑:'축',寅:'인',卯:'묘',辰:'진',巳:'사',午:'오',未:'미',申:'신',酉:'유',戌:'술',亥:'해'};
const ANIMAL_KO={子:'쥐',丑:'소',寅:'호랑이',卯:'토끼',辰:'용',巳:'뱀',午:'말',未:'양',申:'원숭이',酉:'닭',戌:'개',亥:'돼지'};
const SHISHEN_KO={比肩:'비견',劫财:'겁재',食神:'식신',伤官:'상관',偏财:'편재',正财:'정재',七杀:'편관',偏官:'편관',正官:'정관',偏印:'편인',正印:'정인'};
const COMPLEMENT={
  목:{months:[2,3,4],best:3,zodiacs:['토끼띠','호랑이띠'],bestZodiac:'토끼띠',message:'봄의 목 기운을 보완하는 방향'},
  화:{months:[4,5,6],best:6,zodiacs:['말띠','뱀띠'],bestZodiac:'말띠',message:'초여름~한여름의 화 기운을 보완하는 방향'},
  토:{months:[1,4,7,10],best:7,zodiacs:['용띠','소띠','양띠','개띠'],bestZodiac:'용띠',message:'계절 전환기의 토 기운을 보완하는 방향'},
  금:{months:[8,9,10],best:9,zodiacs:['닭띠','원숭이띠'],bestZodiac:'닭띠',message:'가을의 금 기운을 보완하는 방향'},
  수:{months:[11,12,1],best:12,zodiacs:['돼지띠','쥐띠'],bestZodiac:'돼지띠',message:'겨울의 수 기운을 보완하는 방향'}
};
function ganzhiKo(v=''){return [...String(v)].map(ch=>GAN_KO[ch]||ZHI_KO[ch]||ch).join('')}
function shishenKo(v=''){return SHISHEN_KO[v]||v}
function wuxingTextKo(v=''){return [...String(v)].map(ch=>ELS[ch]||({木:'목',火:'화',土:'토',金:'금',水:'수'}[ch])||ch).join('·')}
function zhiAnimal(v=''){const z=[...String(v)][1]||[...String(v)][0];return ANIMAL_KO[z]?ANIMAL_KO[z]+'띠':''}
function monthListText(xs){return xs.map(x=>`${x}월`).join(' · ')}

const ACT_KO = {
  嫁娶:'혼인·관계 약속', 纳采:'약속·협의', 订盟:'약속·협의', 交易:'거래', 立券:'계약', 开市:'업무·영업 시작',
  移徙:'이동·이사', 入宅:'입주·이사', 出行:'외출·이동', 会亲友:'친지·지인 만남', 求财:'재정 활동',
  祈福:'마음 정리', 祭祀:'기념·정리', 求医:'건강 점검', 修造:'수리·정비', 安床:'휴식 환경 정돈',
  入学:'학업 시작', 求学:'학업', 开光:'새 출발 준비', 沐浴:'정돈·목욕', 理发:'이발·외모 정리',
  纳财:'재정 정리', 赴任:'업무 시작', 上梁:'공사·정비', 动土:'공사·정비', 修坟:'묘역 정비', 安葬:'장례 관련',
  破土:'토지·묘역 작업', 栽种:'식재·가꾸기', 牧养:'돌봄', 纳畜:'돌봄', 开仓:'보관·정리',
  作灶:'주방 정비', 扫舍:'청소·정리', 拆卸:'철거·정비', 挂匾:'간판·표식 설치', 安机械:'설비 정비',
  造车器:'제작·정비', 置产:'재산 관련', 安门:'문·시설 정비', 伐木:'목재 작업', 掘井:'우물·설비 작업',
  针灸:'침구 치료', 捕捉:'포획·정리', 畋猎:'사냥 관련', 结网:'그물·도구 정비', 塑绘:'그림·장식 작업',
  酬神:'기원·감사', 齐醮:'의례·마음 정리', 斋醮:'의례·마음 정리', 入殓:'장례 관련', 移柩:'장례 관련',
  成服:'장례 관련', 除服:'장례 관련', 启钻:'묘역 작업', 合帐:'침구·생활 정비', 裁衣:'의복 정리',
  经络:'정비·관리', 平治道涂:'길·환경 정비', 造畜稠:'시설·돌봄', 教牛马:'훈련·돌봄', 造庙:'시설·의례',
  盖屋:'건축·정비', 起基:'공사 시작', 定磉:'건축 작업', 竖柱:'건축 작업', 开池:'시설·정비', 放水:'수로·정비'
};

const DAYMASTER = {
  甲:{name:'갑목',symbol:'큰 나무',summary:'기준을 세우고 앞으로 뻗어가려는 힘으로 해석합니다.',traits:['목표가 정해지면 꾸준히 밀어가는 편','원칙과 방향을 중요하게 보는 편','지나치게 한 방향만 고집하지 않는 유연성이 도움']},
  乙:{name:'을목',symbol:'덩굴과 풀',summary:'환경을 읽고 유연하게 길을 찾는 힘으로 해석합니다.',traits:['사람과 분위기를 세심하게 읽는 편','직선보다 우회와 조율에 강한 편','상대에게 맞추느라 내 기준을 놓치지 않는 것이 중요']},
  丙:{name:'병화',symbol:'태양',summary:'밖으로 드러내고 주변을 밝히는 힘으로 해석합니다.',traits:['표현과 추진력이 비교적 빠른 편','분위기를 움직이는 데 강점이 있는 편','속도가 앞설 때는 확인 한 번이 도움이 됨']},
  丁:{name:'정화',symbol:'등불',summary:'필요한 곳을 세밀하게 비추는 힘으로 해석합니다.',traits:['집중과 섬세한 표현에 강한 편','가까운 관계에 정성을 쓰는 편','감정을 오래 안에 담아두지 않는 것이 도움']},
  戊:{name:'무토',symbol:'큰 산과 땅',summary:'버티고 지탱하며 중심을 잡는 힘으로 해석합니다.',traits:['책임과 안정성을 중요하게 보는 편','급변보다 준비된 변화를 선호하는 편','변화가 필요할 때 너무 오래 버티지 않는 것이 중요']},
  己:{name:'기토',symbol:'논밭과 흙',summary:'돌보고 다듬어 결과를 만드는 힘으로 해석합니다.',traits:['실무와 관리에 강점을 보이는 편','주변을 챙기고 정리하는 능력이 있는 편','남의 일을 모두 떠안지 않는 경계가 도움']},
  庚:{name:'경금',symbol:'단단한 쇠',summary:'결단하고 불필요한 것을 잘라내는 힘으로 해석합니다.',traits:['판단이 서면 실행이 빠른 편','공정한 기준과 효율을 중시하는 편','말이 너무 단단해지지 않도록 완충이 도움']},
  辛:{name:'신금',symbol:'보석과 세공된 금속',summary:'정교하게 고르고 완성도를 높이는 힘으로 해석합니다.',traits:['디테일과 품질을 잘 보는 편','기준이 분명하고 선택이 섬세한 편','완벽을 기다리다 시작이 늦어지지 않게 주의']},
  壬:{name:'임수',symbol:'큰 강과 바다',summary:'넓게 흐르며 새로운 길을 만드는 힘으로 해석합니다.',traits:['정보와 가능성을 넓게 보는 편','변화와 이동에 비교적 열린 편','관심사가 넓어질 때 우선순위를 좁히는 것이 도움']},
  癸:{name:'계수',symbol:'비와 이슬',summary:'주변 변화를 섬세하게 읽고 스며드는 힘으로 해석합니다.',traits:['상황과 사람의 미묘한 차이를 잘 보는 편','충분히 생각한 뒤 움직이는 편','생각이 길어져 타이밍을 놓치지 않는 것이 중요']}
};

const PURPOSE_KEYS = {
  '중요한 대화':['会亲友','纳采','订盟','嫁娶'],
  '계약·거래':['交易','立券','开市','纳财'],
  '소개팅·만남':['嫁娶','纳采','订盟','会亲友'],
  '이사·이동':['移徙','入宅','出行'],
  '공부·시험 준비':['求学','入学','祈福'],
  '정리·휴식':['安床','扫舍','沐浴','祈福','祭祀']
};

function profile(){try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch{return null}}
function saveLocal(p){localStorage.setItem(STORE,JSON.stringify(p))}
function ymd(s){const [y,m,d]=s.split('-').map(Number);return {y,m,d}}
function pad(n){return String(n).padStart(2,'0')}
function todayYmd(){const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`}
function formatDateKo(ds){const {y,m,d}=ymd(ds);return `${y}.${pad(m)}.${pad(d)}`}
function engineOK(){return typeof Solar!=='undefined' && typeof Lunar!=='undefined'}

function loadEngine(){
  if(engineOK()) return Promise.resolve(true);
  return new Promise(resolve=>{
    let done=false;
    const finish=(v)=>{if(done)return;done=true;resolve(v);if(v){renderHome();renderProfile()}};
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/lunar-javascript/1.7.7/lunar.min.js';
    s.async=true;
    s.onload=()=>finish(engineOK());
    s.onerror=()=>finish(false);
    document.head.appendChild(s);
    setTimeout(()=>finish(engineOK()),6000);
  });
}

function solarFromProfile(p){
  if(!engineOK()) throw Error('정밀 만세력 엔진을 불러오지 못했습니다. 인터넷 연결 상태에서 한 번 실행한 뒤 다시 시도하세요.');
  const {y,m,d}=ymd(p.birthDate);
  const [hh,mm]=(p.birthTime||'12:00').split(':').map(Number);
  if(p.calendarType==='lunar'){
    const lm=p.leapMonth?-m:m;
    return Lunar.fromYmdHms(y,lm,d,hh||0,mm||0,0).getSolar();
  }
  return Solar.fromYmdHms(y,m,d,hh||0,mm||0,0);
}
function ecFromSolar(s,p){const e=s.getLunar().getEightChar();try{e.setSect(Number(p.sect||2))}catch{}return e}
function countElements(ec,p){const ps=[ec.getYear(),ec.getMonth(),ec.getDay()];if(p.timeKnown!=='unknown')ps.push(ec.getTime());const c={목:0,화:0,토:0,금:0,수:0};ps.forEach(x=>[...x].forEach(ch=>{if(ELS[ch])c[ELS[ch]]++}));return c}

function interaction(a,b){
  const clash={子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
  const combine={子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午'};
  if(clash[a]===b) return {type:'충',text:'변화나 의견 차이가 두드러질 수 있어 서두르기보다 확인이 필요한 흐름'};
  if(combine[a]===b) return {type:'합',text:'연결·협업·대화가 비교적 자연스럽게 이어질 수 있는 흐름'};
  return {type:'평',text:'큰 충·합보다 평소 리듬과 현실 조건을 우선하는 흐름'};
}

function relation(natalGan,dayGan){
  const a=ELS[natalGan], b=ELS[dayGan];
  if(a===b)return '동질';
  if(GEN[a]===b)return '표현';
  if(GEN[b]===a)return '지원';
  if(CTRL[a]===b)return '관리';
  if(CTRL[b]===a)return '압박';
  return '중립';
}

function dayInfo(dateStr,p){
  if(!engineOK()) throw Error('만세력 엔진 연결이 필요합니다.');
  const {y,m,d}=ymd(dateStr);
  const s=Solar.fromYmdHms(y,m,d,12,0,0), l=s.getLunar(), ec=l.getEightChar();
  try{ec.setSect(Number(p.sect||2))}catch{}
  const natal=ecFromSolar(solarFromProfile(p),p);
  const inter=interaction(natal.getDayZhi(),ec.getDayZhi());
  const rel=relation(natal.getDayGan(),ec.getDayGan());
  const yi=(l.getDayYi?.()||l.getYi?.()||[]), ji=(l.getDayJi?.()||l.getJi?.()||[]);
  const base=65+(inter.type==='합'?10:inter.type==='충'?-12:0)+({지원:8,동질:4,표현:5,관리:1,압박:-7,중립:0}[rel]||0);
  return {s,l,ec,natal,inter,rel,yi,ji,score:Math.max(35,Math.min(92,base))};
}

function actKo(v){return ACT_KO[v]||null}
function translateActs(arr,limit=5){
  const out=[];
  for(const v of arr||[]){const k=actKo(v);if(k&&!out.includes(k))out.push(k);if(out.length>=limit)break}
  return out;
}
function purposeScore(info,purpose){
  let s=info.score; const good=(info.yi||[]), bad=(info.ji||[]);
  (PURPOSE_KEYS[purpose]||[]).forEach(k=>{if(good.includes(k))s+=5;if(bad.includes(k))s-=7});
  return Math.max(30,Math.min(96,s));
}
function grade(score){
  if(score>=85)return {label:'매우 좋음',stars:'★★★★★',cls:'grade-5'};
  if(score>=77)return {label:'좋음',stars:'★★★★☆',cls:'grade-4'};
  if(score>=67)return {label:'무난',stars:'★★★☆☆',cls:'grade-3'};
  return {label:'신중',stars:'★★☆☆☆',cls:'grade-2'};
}
function choice(score,risky=false){
  if(risky)return {title:'현실 판단을 먼저',cls:'choice-warn',sub:'명리는 참고만 하세요.'};
  if(score>=78)return {title:'해도 좋습니다',cls:'choice-good',sub:'작게 시작하면 더 자연스럽습니다.'};
  if(score>=66)return {title:'무난합니다',cls:'choice-neutral',sub:'상대 상황을 확인하며 진행하세요.'};
  return {title:'조금 신중하게',cls:'choice-warn',sub:'오늘 꼭 해야 하는지 한 번 더 확인해보세요.'};
}

function classifyQuestion(q){
  const risky=/주식|코인|투자|매수|매도|대출|수술|복용|약을|응급|병원|진단|법률|고소|소송|해고|사직서/.test(q);
  let type='대화', purpose='중요한 대화';
  if(/과자|간식|커피|차를|밥|식사|선물|사주고|건네/.test(q)) type='가벼운 호의';
  else if(/사과|화해|연락|문자|카톡|말해|얘기|이야기|대화|보고|요청|부탁|설득/.test(q)) type='대화';
  else if(/계약|거래|서명|구매|매매/.test(q)){type='계약';purpose='계약·거래'}
  else if(/소개팅|데이트|고백|연애|만남|약속/.test(q)){type='만남';purpose='소개팅·만남'}
  else if(/이사|이동|여행|출발|출장/.test(q)){type='이동';purpose='이사·이동'}
  else if(/시험|공부|지원서|면접|발표|과제/.test(q)){type='학업·업무'}
  else if(/정리|쉬어|휴식|청소/.test(q)){type='정리·휴식';purpose='정리·휴식'}
  return {risky,type,purpose};
}

function realityText(type,q,risky){
  if(risky)return '돈·건강·법률처럼 결과가 큰 결정은 가격·계약조건·검사결과·전문가 의견 같은 객관적 근거를 먼저 확인하는 것이 안전합니다.';
  const map={
    '가벼운 호의':'간식이나 커피처럼 부담이 작은 호의는 상대가 바쁜지만 살피면 자연스럽게 관계를 부드럽게 만드는 행동이 될 수 있습니다.',
    '대화':'대화의 성패는 오늘의 운보다 상대의 일정, 감정 상태, 내가 전달할 핵심이 정리되어 있는지가 더 크게 좌우합니다.',
    '계약':'계약은 날짜보다 금액·해지조건·책임범위·서면 내용을 우선 확인해야 합니다. 서두르지 않고 문구를 한 번 더 읽는 것이 중요합니다.',
    '만남':'만남은 서로의 일정과 기대 수준이 맞는지가 가장 중요합니다. 부담 없는 시간과 장소를 먼저 제안하는 편이 좋습니다.',
    '이동':'이동은 교통·날씨·예약·준비 상태를 우선 확인하세요. 중요한 이동일수록 여유 시간을 두는 것이 좋습니다.',
    '학업·업무':'시험·면접·발표는 준비도와 반복 연습이 가장 큰 변수입니다. 오늘은 한 번에 많이 하기보다 핵심을 좁혀 점검해보세요.',
    '정리·휴식':'휴식과 정리는 미루기보다 작은 범위를 정해 바로 시작하면 체감 효과가 큽니다.'
  };
  return map[type]||'현실 조건과 상대 상황을 먼저 확인하고, 부담이 작은 범위에서 시작하는 것이 좋습니다.';
}

function recommendationText(type,i,score,risky){
  if(risky)return '명리 결과로 결정을 확정하지 말고 객관적 자료를 확인한 뒤 필요하면 전문가와 상의하세요.';
  const positive=i.inter.type==='합'||score>=78;
  if(type==='가벼운 호의')return positive?'거창한 자리를 만들기보다 “같이 먹어요” 정도로 가볍게 건네고, 상대 반응이 좋으면 잠깐 이야기를 이어가세요.':'간식은 부담 없이 건네되 상대가 바쁘면 대화를 길게 잡지 말고 다음 기회를 두세요.';
  if(type==='대화')return positive?'핵심을 한두 문장으로 정리한 뒤 먼저 대화를 열어보세요. 결론을 강요하기보다 상대 반응을 확인하는 방식이 좋습니다.':'바로 결론을 내리기보다 필요한 말만 먼저 전달하고, 중요한 결정은 한 번 더 확인한 뒤 확정하세요.';
  if(type==='계약')return '오늘 진행하더라도 서명 전 금액·기간·해지·책임 조항을 다시 확인하고, 애매한 문구는 문서로 정리하세요.';
  if(type==='만남')return positive?'부담 없는 약속부터 잡아보세요. 긴 계획보다 편하게 대화할 수 있는 시간대를 고르는 편이 좋습니다.':'약속 자체는 가능하지만 무리하게 분위기를 만들기보다 상대 일정과 컨디션을 우선하세요.';
  if(type==='이동')return '시간 여유를 확보하고 예약·교통·준비물을 미리 확인한 뒤 움직이세요.';
  if(type==='학업·업무')return '가장 중요한 한 가지를 먼저 끝내고, 제출·발표 전 체크리스트로 누락을 확인하세요.';
  return '작은 범위부터 실행하고 결과를 확인한 뒤 다음 행동을 정하세요.';
}

function whyText(i,purpose){
  const parts=[];
  if(i.inter.type==='합')parts.push('내 일주와 합의 신호가 있어 연결·협업 쪽에 가점');
  else if(i.inter.type==='충')parts.push('내 일주와 충의 신호가 있어 서두르는 행동에는 감점');
  else parts.push('내 일주와 큰 충·합 없이 비교적 평이한 흐름');
  const relMap={지원:'도움을 받거나 받아들이는 흐름',표현:'말·표현·실행으로 내보내는 흐름',동질:'내 페이스를 유지하기 쉬운 흐름',관리:'조건을 정리하고 관리하는 흐름',압박:'요구·부담을 크게 느낄 수 있는 흐름',중립:'특정 방향보다 현실 조건이 중요한 흐름'};
  parts.push(relMap[i.rel]||relMap.중립);
  const keys=PURPOSE_KEYS[purpose]||[];
  const matched=keys.filter(k=>(i.yi||[]).includes(k)).map(actKo).filter(Boolean);
  if(matched.length)parts.push(`전통력의 권장 항목에 ${matched.slice(0,2).join('·')} 포함`);
  return parts;
}

function renderHome(){
  const p=profile();
  $('#headline').textContent=p?'오늘의 흐름을 계산했습니다.':'내 사주를 등록하면 오늘의 흐름을 보여드립니다.';
  if(!p){$('#homeMeta').innerHTML='';$('#metrics').innerHTML=['직장','금전','관계','집중','이동','휴식'].map(x=>`<div class="metric"><span>${x}</span><b>--</b></div>`).join('');return}
  try{
    const i=dayInfo(todayYmd(),p), names=['직장','금전','관계','집중','이동','휴식'];
    const adj={직장:0,금전:i.rel==='관리'?6:0,관계:i.inter.type==='합'?10:i.inter.type==='충'?-10:0,집중:i.rel==='압박'?-5:5,이동:i.inter.type==='충'?-5:2,휴식:i.rel==='압박'?8:0};
    $('#headline').textContent=i.inter.type==='합'?'사람과 연결하면 흐름이 살아나는 날.':i.inter.type==='충'?'속도보다 확인이 중요한 날.':'크게 벌이기보다 기본 리듬을 지키는 날.';
    $('#homeMeta').innerHTML=`<span class="chip">오늘 ${ganzhiKo(i.ec.getDay())}</span><span class="chip">${i.rel} 흐름</span><span class="chip">${i.inter.type}</span>`;
    $('#metrics').innerHTML=names.map(x=>{const g=grade(Math.max(35,Math.min(95,i.score+adj[x])));return `<div class="metric"><span>${x}</span><b>${g.label}</b></div>`}).join('');
    let acts=translateActs(i.yi,3); if(!acts.length)acts=['중요한 일 한 가지 마무리','상대 반응을 확인하며 대화','기록하고 한 번 더 확인하기'];
    $('#actions').innerHTML=acts.map((x,n)=>`<div><b>${n+1}.</b> ${x}</div>`).join('');
    const yi=translateActs(i.yi,4), ji=translateActs(i.ji,4);
    $('#todayBasis').innerHTML=`<div><b>오늘의 관계</b><br>${i.inter.text}</div><div><b>기운의 방향</b><br>${whyText(i,'중요한 대화')[1]}</div><div><b>전통력에서 권하는 활동</b><br>${yi.join(' · ')||'뚜렷한 생활 항목 없음'}</div><div><b>전통력에서 신중한 활동</b><br>${ji.join(' · ')||'뚜렷한 생활 항목 없음'}</div><details><summary>전문 명리 정보 보기</summary><p class="small">오늘 일진 ${ganzhiKo(i.ec.getDay())} · 내 일주와 ${i.inter.type} · 일간 오행 관계 ${i.rel}</p></details>`;
  }catch(e){$('#todayBasis').innerHTML=`<div class="pillwarn">${e.message}</div>`}
}



// ===== 오늘결 4.0 · 확장 명리 모듈 =====
const STEM_YINYANG={甲:'양',乙:'음',丙:'양',丁:'음',戊:'양',己:'음',庚:'양',辛:'음',壬:'양',癸:'음'};
const ZHI_HIDDEN={子:['癸'],丑:['己','癸','辛'],寅:['甲','丙','戊'],卯:['乙'],辰:['戊','乙','癸'],巳:['丙','戊','庚'],午:['丁','己'],未:['己','丁','乙'],申:['庚','壬','戊'],酉:['辛'],戌:['戊','辛','丁'],亥:['壬','甲']};
const HIDE_ROLE=['본기','중기','여기'];
const BRANCHES=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const STEMS=['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const SAMJAE_GROUPS=[
  {born:['申','子','辰'],years:['寅','卯','辰'],name:'신·자·진'},
  {born:['寅','午','戌'],years:['申','酉','戌'],name:'인·오·술'},
  {born:['巳','酉','丑'],years:['亥','子','丑'],name:'사·유·축'},
  {born:['亥','卯','未'],years:['巳','午','未'],name:'해·묘·미'}
];
const STAGE_KO={长生:'장생',沐浴:'목욕',冠带:'관대',临官:'임관',帝旺:'제왕',衰:'쇠',病:'병',死:'사',墓:'묘',绝:'절',胎:'태',养:'양'};
const NAYIN_KO={'海中金':'해중금','炉中火':'노중화','大林木':'대림목','路旁土':'노방토','剑锋金':'검봉금','山头火':'산두화','涧下水':'간하수','城头土':'성두토','白蜡金':'백랍금','杨柳木':'양류목','泉中水':'천중수','屋上土':'옥상토','霹雳火':'벽력화','松柏木':'송백목','长流水':'장류수','沙中金':'사중금','山下火':'산하화','平地木':'평지목','壁上土':'벽상토','金箔金':'금박금','覆灯火':'복등화','天河水':'천하수','大驿土':'대역토','钗钏金':'채천금','桑柘木':'상자목','大溪水':'대계수','沙中土':'사중토','天上火':'천상화','石榴木':'석류목','大海水':'대해수'};
function safeCall(o,m,...a){try{return typeof o?.[m]==='function'?o[m](...a):null}catch{return null}}
function yearBranch(y){return BRANCHES[((y-4)%12+12)%12]}
function yearGan(y){return STEMS[((y-4)%10+10)%10]}
function yearGanzhiKo(y){return `${GAN_KO[yearGan(y)]}${ZHI_KO[yearBranch(y)]}`}
function animalFromBranch(z){return ANIMAL_KO[z]?ANIMAL_KO[z]+'띠':''}
function samjaeInfo(natalZhi,baseYear=new Date().getFullYear()){
  const g=SAMJAE_GROUPS.find(x=>x.born.includes(natalZhi)); if(!g)return null;
  const at=(y)=>{const z=yearBranch(y),idx=g.years.indexOf(z);return idx>=0?{year:y,z,stage:['들삼재','눌삼재','날삼재'][idx],index:idx}:null};
  const current=at(baseYear);
  let nextStart=null,prevStart=null;
  for(let y=baseYear;y<=baseYear+24;y++){const x=at(y);if(x&&x.index===0){nextStart=y;break}}
  for(let y=baseYear;y>=baseYear-24;y--){const x=at(y);if(x&&x.index===0){prevStart=y;break}}
  if(current&&current.index>0) nextStart=baseYear-current.index;
  const start=current?baseYear-current.index:(nextStart??baseYear);
  const cycle=[0,1,2].map(i=>({year:start+i,stage:['들삼재','눌삼재','날삼재'][i],z:yearBranch(start+i)}));
  let futureStart=start;
  if(current) futureStart=start+12; else if(start<baseYear) futureStart=start+12;
  const future=[0,1,2].map(i=>({year:futureStart+i,stage:['들삼재','눌삼재','날삼재'][i],z:yearBranch(futureStart+i)}));
  return {group:g,current,start,cycle,futureStart,future};
}
function branchRelations(pillars){
  const zs=pillars.filter(x=>x[1]&&x[1]!=='미상').map(x=>({label:x[0],z:x[1][1]}));
  const clash={子:'午',午:'子',丑:'未',未:'丑',寅:'申',申:'寅',卯:'酉',酉:'卯',辰:'戌',戌:'辰',巳:'亥',亥:'巳'};
  const combine={子:'丑',丑:'子',寅:'亥',亥:'寅',卯:'戌',戌:'卯',辰:'酉',酉:'辰',巳:'申',申:'巳',午:'未',未:'午'};
  const harm={子:'未',未:'子',丑:'午',午:'丑',寅:'巳',巳:'寅',卯:'辰',辰:'卯',申:'亥',亥:'申',酉:'戌',戌:'酉'};
  const brk={子:'酉',酉:'子',丑:'辰',辰:'丑',寅:'亥',亥:'寅',卯:'午',午:'卯',巳:'申',申:'巳',未:'戌',戌:'未'};
  const out=[];
  for(let i=0;i<zs.length;i++)for(let j=i+1;j<zs.length;j++){
    const a=zs[i],b=zs[j]; let t='';
    if(clash[a.z]===b.z)t='충'; else if(combine[a.z]===b.z)t='합'; else if(harm[a.z]===b.z)t='해'; else if(brk[a.z]===b.z)t='파';
    if(t)out.push(`${a.label} ${ZHI_KO[a.z]} ↔ ${b.label} ${ZHI_KO[b.z]} : ${t}`)
  }
  const vals=zs.map(x=>x.z);
  [['寅','巳','申'],['丑','戌','未']].forEach(set=>{if(set.every(z=>vals.includes(z)))out.push(`${set.map(z=>ZHI_KO[z]).join('·')} : 삼형`)});
  if(vals.filter(z=>z==='子').length>=2||vals.filter(z=>z==='卯').length>=2||vals.filter(z=>z==='辰').length>=2||vals.filter(z=>z==='午').length>=2||vals.filter(z=>z==='酉').length>=2||vals.filter(z=>z==='亥').length>=2)out.push('같은 지지가 반복되어 자형 가능성을 함께 참고');
  return [...new Set(out)];
}
function shensalList(ec,p){
  const dg=ec.getDayGan(), yz=ec.getYearZhi(), dz=ec.getDayZhi();
  const zs=[ec.getYearZhi(),ec.getMonthZhi(),ec.getDayZhi()]; if(p.timeKnown!=='unknown')zs.push(ec.getTimeZhi());
  const out=[];
  const tianyi={甲:['丑','未'],乙:['子','申'],丙:['亥','酉'],丁:['亥','酉'],戊:['丑','未'],己:['子','申'],庚:['丑','未'],辛:['寅','午'],壬:['卯','巳'],癸:['卯','巳']};
  const wenchang={甲:'巳',乙:'午',丙:'申',丁:'酉',戊:'申',己:'酉',庚:'亥',辛:'子',壬:'寅',癸:'卯'};
  const lushen={甲:'寅',乙:'卯',丙:'巳',丁:'午',戊:'巳',己:'午',庚:'申',辛:'酉',壬:'亥',癸:'子'};
  const yangren={甲:'卯',乙:'寅',丙:'午',丁:'巳',戊:'午',己:'巳',庚:'酉',辛:'申',壬:'子',癸:'亥'};
  if((tianyi[dg]||[]).some(z=>zs.includes(z)))out.push(['천을귀인','도움·중재·인연을 상징하는 길신']);
  if(zs.includes(wenchang[dg]))out.push(['문창귀인','학습·기록·표현과 연결해 보는 신살']);
  if(zs.includes(lushen[dg]))out.push(['건록','자립·직업·생활 기반과 연결해 보는 기운']);
  if(zs.includes(yangren[dg]))out.push(['양인','결단·강한 추진력을 상징하나 과하면 충돌로 보는 신살']);
  const groups=[{set:['申','子','辰'],tao:'酉',yi:'寅',hua:'辰',jiang:'子'},{set:['寅','午','戌'],tao:'卯',yi:'申',hua:'戌',jiang:'午'},{set:['巳','酉','丑'],tao:'午',yi:'亥',hua:'丑',jiang:'酉'},{set:['亥','卯','未'],tao:'子',yi:'巳',hua:'未',jiang:'卯'}];
  const g=groups.find(x=>x.set.includes(dz))||groups.find(x=>x.set.includes(yz));
  if(g){if(zs.includes(g.tao))out.push(['도화','교류·매력·대인 노출과 연결해 보는 신살']);if(zs.includes(g.yi))out.push(['역마','이동·변화·활동성과 연결해 보는 신살']);if(zs.includes(g.hua))out.push(['화개','집중·예술·철학·고독성과 연결해 보는 신살']);if(zs.includes(g.jiang))out.push(['장성','주도권·리더십·실행력과 연결해 보는 신살']);}
  return out;
}
function hiddenStemHtml(ec,p){
  const ps=[['년지',ec.getYearZhi()],['월지',ec.getMonthZhi()],['일지',ec.getDayZhi()]];if(p.timeKnown!=='unknown')ps.push(['시지',ec.getTimeZhi()]);
  return `<div class="mini-grid">${ps.map(([l,z])=>`<div class="mini-card"><span>${l} ${ZHI_KO[z]}</span>${(ZHI_HIDDEN[z]||[]).map((g,i)=>`<b>${HIDE_ROLE[i]||'여기'} ${GAN_KO[g]}(${ELS[g]})</b>`).join('')}</div>`).join('')}</div>`;
}
function luckTimeline(ec,p,nowYear){
  let html='';
  try{
    const yun=ec.getYun(p.gender==='male'?1:0,2), all=yun.getDaYun().slice(1,11), startSolar=safeCall(yun,'getStartSolar');
    let currentIdx=-1;
    const rows=all.map((x,idx)=>{const sy=Number(safeCall(x,'getStartYear')||0),ey=Number(safeCall(x,'getEndYear')||0),sa=safeCall(x,'getStartAge')??'',ea=safeCall(x,'getEndAge')??'',gz=safeCall(x,'getGanZhi')||'';const cur=(sy&&ey&&nowYear>=sy&&nowYear<=ey);if(cur)currentIdx=idx;return {sy,ey,sa,ea,gz,cur}});
    const next=rows.find(r=>r.sy>nowYear);
    html=`<div class="timeline-head"><div><span>대운 시작</span><strong>${startSolar?.toYmd?.()||'계산됨'}</strong></div><div><span>현재 대운</span><strong>${currentIdx>=0?ganzhiKo(rows[currentIdx].gz):'확인 중'}</strong></div></div><div class="luck-timeline">${rows.map(r=>`<div class="luck-item ${r.cur?'current':''}"><span>${r.sa}${r.ea!==''?'~'+r.ea:''}세</span><b>${ganzhiKo(r.gz)}</b><small>${r.sy||''}${r.ey?'~'+r.ey:''}</small>${r.cur?'<em>현재</em>':''}</div>`).join('')}</div>${next?`<div class="reasonbox"><b>다음 대운 전환</b>${next.sy}년경 ${ganzhiKo(next.gz)} 대운으로 넘어가는 흐름입니다. 대운 경계 시점은 출생시각·절기 계산에 따라 세부 날짜가 정해집니다.</div>`:''}`;
  }catch{html='<p class="muted">대운 계산 정보를 불러오지 못했습니다.</p>'}
  return html;
}
function annualLuckHtml(ec,p,nowYear){
  const natalDayZhi=ec.getDayZhi(),natalDayGan=ec.getDayGan(),natalYearZhi=ec.getYearZhi();
  let rows=[];
  for(let y=nowYear;y<nowYear+10;y++){
    const z=yearBranch(y),g=yearGan(y),it=interaction(natalDayZhi,z),rel=relation(natalDayGan,g),yr=interaction(natalYearZhi,z);
    rows.push({y,z,g,it,rel,yr});
  }
  return `<div class="annual-list">${rows.map((r,i)=>`<div class="annual-row ${i===0?'current':''}"><span>${r.y}</span><b>${GAN_KO[r.g]}${ZHI_KO[r.z]} · ${animalFromBranch(r.z)}</b><small>일지 ${r.it.type} · 일간 ${r.rel}${r.yr.type!=='평'?` · 띠 ${r.yr.type}`:''}</small></div>`).join('')}</div>`;
}
function samjaeHtml(ec,nowYear){
  const sj=samjaeInfo(ec.getYearZhi(),nowYear); if(!sj)return '';
  const cur=sj.current;
  const status=cur?`${nowYear}년은 <b>${cur.stage}</b>입니다.`:`${nowYear}년은 삼재가 아닙니다.`;
  return `<div class="samjae-card"><div class="samjae-status ${cur?'active':''}"><span>${animalFromBranch(ec.getYearZhi())} · ${sj.group.name} 삼합</span><strong>${cur?cur.stage:'삼재 아님'}</strong><p>${status} 삼재는 출생년의 띠만으로 계산하는 한국 민간 전통으로, 사주 전체 운세와는 별개입니다.</p></div><h4>${cur?'현재 삼재 3년':'다음 삼재'}</h4><div class="samjae-grid">${(cur?sj.cycle:sj.future).map(x=>`<div><span>${x.year}</span><b>${x.stage}</b><small>${yearGanzhiKo(x.year)} · ${animalFromBranch(x.z)}</small></div>`).join('')}</div>${cur?`<p class="small muted">다음 들삼재는 ${sj.futureStart}년입니다.</p>`:`<p class="small muted">다음 들삼재는 ${sj.futureStart}년부터 시작합니다.</p>`}</div>`;
}
function advancedPillarTable(ec,p){
  const arr=[['년주',ec.getYear(),safeCall(ec,'getYearShiShenGan'),safeCall(ec,'getYearNaYin'),safeCall(ec,'getYearDiShi'),safeCall(ec,'getYearXunKong')],['월주',ec.getMonth(),safeCall(ec,'getMonthShiShenGan'),safeCall(ec,'getMonthNaYin'),safeCall(ec,'getMonthDiShi'),safeCall(ec,'getMonthXunKong')],['일주',ec.getDay(),'일간',safeCall(ec,'getDayNaYin'),safeCall(ec,'getDayDiShi'),safeCall(ec,'getDayXunKong')]];if(p.timeKnown!=='unknown')arr.push(['시주',ec.getTime(),safeCall(ec,'getTimeShiShenGan'),safeCall(ec,'getTimeNaYin'),safeCall(ec,'getTimeDiShi'),safeCall(ec,'getTimeXunKong')]);
  return `<div class="detail-table"><div class="detail-row head"><span>기둥</span><span>간지</span><span>십신</span><span>납음</span><span>십이운성</span><span>공망</span></div>${arr.map(r=>`<div class="detail-row"><span>${r[0]}</span><b>${ganzhiKo(r[1])}</b><span>${shishenKo(r[2]||'—')}</span><span>${NAYIN_KO[r[3]]||r[3]||'—'}</span><span>${STAGE_KO[r[4]]||r[4]||'—'}</span><span>${ganzhiKo(r[5]||'—')}</span></div>`).join('')}</div>`;
}
function strengthHint(c,ec){
  const dm=ELS[ec.getDayGan()],support=[dm,Object.keys(GEN).find(k=>GEN[k]===dm)].filter(Boolean),monthEl=ELS[ec.getMonthZhi()];
  let sup=0,total=0;Object.entries(c).forEach(([k,v])=>{total+=v;if(support.includes(k))sup+=v});let pct=total?Math.round(sup/total*100):0;if(support.includes(monthEl))pct=Math.min(100,pct+15);
  const label=pct>=65?'신강 쪽':pct<=35?'신약 쪽':'중화에 가까움';
  const candidate=pct>=65?[GEN[dm],CTRL[dm]].filter(Boolean):[dm,Object.keys(GEN).find(k=>GEN[k]===dm)].filter(Boolean);
  return {pct,label,candidate:[...new Set(candidate)]};
}

function renderProfile(){
  const p=profile(); if(!p)return;
  ['name','birthDate','birthTime','gender','calendarType','timeKnown','sect'].forEach(id=>{if($('#'+id)&&p[id]!=null)$('#'+id).value=p[id]});
  $('#leapMonth').checked=!!p.leapMonth; $('#lunarExtra').hidden=p.calendarType!=='lunar';
  try{
    const s=solarFromProfile(p), e=ecFromSolar(s,p), c=countElements(e,p), total=Object.values(c).reduce((a,b)=>a+b,0), dm=DAYMASTER[e.getDayGan()]||{name:ganzhiKo(e.getDayGan()),symbol:ELS[e.getDayGan()],summary:'일간을 중심으로 해석합니다.',traits:[]};
    const entries=Object.entries(c),sorted=[...entries].sort((a,b)=>b[1]-a[1]),high=sorted[0],minVal=Math.min(...entries.map(x=>x[1])),lowEls=entries.filter(x=>x[1]===minVal).map(x=>x[0]),need=lowEls[0],comp=COMPLEMENT[need];
    const pillars=[['년주',e.getYear()],['월주',e.getMonth()],['일주',e.getDay()],['시주',p.timeKnown==='unknown'?'미상':e.getTime()]], fullEight=pillars.map(([label,v])=>`${label} ${v==='미상'?'미상':ganzhiKo(v)}`).join(' · '),animal=zhiAnimal(e.getYear());
    const needDesc=minVal===0?`${need} 기운이 원국의 겉글자에서는 보이지 않습니다.`:`${need} 기운이 ${minVal}글자로 가장 적게 나타납니다.`;
    const strength=strengthHint(c,e),rels=branchRelations(pillars),shens=shensalList(e,p),nowYear=new Date().getFullYear();
    const yinCount=pillars.filter(x=>x[1]!=='미상').flatMap(x=>[...x[1]]).filter(ch=>STEM_YINYANG[ch]==='음'||['丑','卯','巳','未','酉','亥'].includes(ch)).length;
    const chars=pillars.filter(x=>x[1]!=='미상').length*2, yangCount=chars-yinCount;
    $('#profileResult').hidden=false;
    $('#profileResult').innerHTML=`
      <div class="profile-intro"><span class="label">${p.name||'나'}의 일간</span><div class="daymaster">${ganzhiKo(e.getDayGan())} · ${dm.name}</div><p><b>${dm.symbol}</b>에 빗대어, ${dm.summary}</p><div class="trait-list">${dm.traits.map(t=>`<div>${t}</div>`).join('')}</div></div>

      <div class="section-title"><span>원국</span><h3>내 사주팔자 전체</h3></div>
      <div class="full-saju-summary">${fullEight}</div>
      <div class="pillargrid full-pillargrid">${pillars.map(([label,v])=>`<div class="pillar"><span>${label}</span><b>${v==='미상'?'미상':ganzhiKo(v)}</b>${v==='미상'?'':`<small>${label==='년주'?zhiAnimal(v):`${GAN_KO[v[0]]||''}(${ELS[v[0]]||''}) · ${ZHI_KO[v[1]]||''}(${ELS[v[1]]||''})`}</small>`}</div>`).join('')}</div>
      <p class="small muted">${animal?`태어난 해의 띠는 ${animal}입니다. `:''}년·월·일·시 네 기둥을 함께 봅니다.</p>

      <div class="section-title"><span>균형</span><h3>오행 · 음양 · 신강 참고</h3></div>
      ${entries.map(([k,v])=>{const pct=Math.round(v/total*100);return `<div class="element-row"><b>${k}</b><div class="element-track"><div class="element-fill el-${k}" style="width:${pct}%"></div></div><span>${pct}%</span></div>`}).join('')}
      <div class="balance-grid"><div><span>음</span><b>${yinCount}</b></div><div><span>양</span><b>${yangCount}</b></div><div><span>신강 참고</span><b>${strength.label}</b></div></div>
      <div class="reasonbox"><b>한눈에 보기</b>${high[0]} 기운이 상대적으로 많이 보이고 ${lowEls.join('·')} 기운이 가장 적습니다. ${needDesc}<br>자동 신강 참고값은 <b>${strength.label}</b>입니다. 월령·통근·투간·조후 등을 모두 반영하는 전문 용신 판정과는 구분합니다.</div>

      <div class="compat-card"><span class="badge">오행 보완 궁합</span><h3>나에게 보완이 되는 사람</h3><div class="need-element"><span>가장 필요한 기운</span><strong>${need}</strong></div><p>${needDesc} 오행 보완 관점에서는 ${need} 기운이 살아 있는 사람을 참고할 수 있습니다.</p><div class="compat-grid"><div><span>잘 맞는 생월</span><strong>${comp?comp.months.map(x=>x+'월').join(' · '):'—'}</strong><small>${comp?`으뜸 ${comp.best}월생`:'—'}</small></div><div><span>잘 맞는 띠</span><strong>${comp?comp.zodiacs.join(' · '):'—'}</strong><small>${comp?`으뜸 ${comp.bestZodiac}`:'—'}</small></div></div><p class="fade-note">생월은 절기 기준 월지를 보는 것이 더 정확합니다. 띠와 생월만으로 실제 궁합을 확정하지 않습니다.</p></div>

      <div class="section-title"><span>운의 큰 흐름</span><h3>대운은 언제 들어오나</h3></div>
      ${luckTimeline(e,p,nowYear)}

      <div class="section-title"><span>민간 전통</span><h3>삼재는 언제 들어오나</h3></div>
      ${samjaeHtml(e,nowYear)}

      <div class="section-title"><span>앞으로 10년</span><h3>세운 흐름</h3></div>
      <p class="small muted">각 해의 간지와 내 일주·띠의 합충 관계를 한눈에 보는 참고표입니다.</p>${annualLuckHtml(e,p,nowYear)}

      <details class="expert openlike" open><summary>지장간 · 십신 보기</summary>${hiddenStemHtml(e,p)}<p class="small muted">지장간은 각 지지 안에 배속된 천간을 본기·중기·여기로 나누어 보는 전통 명리 요소입니다.</p></details>

      <details class="expert"><summary>납음 · 십이운성 · 공망</summary>${advancedPillarTable(e,p)}<p class="small muted">납음은 60갑자를 별도 오행 명칭으로 분류한 체계이고, 십이운성은 일간의 기운 단계를 12단계로 보는 방식입니다. 공망은 해당 순(旬)에서 비는 두 지지를 말합니다.</p></details>

      <details class="expert"><summary>합 · 충 · 형 · 파 · 해</summary><div class="stack">${rels.length?rels.map(x=>`<div>${x}</div>`).join(''):'<div>원국 네 지지 사이에서 두드러진 합·충·형·파·해 조합이 자동 감지되지 않았습니다.</div>'}</div><p class="small muted">이 항목은 원국 내부 지지 관계를 단순 감지한 것이며, 실제 해석은 월령·용신·세운 등과 함께 봅니다.</p></details>

      <details class="expert"><summary>주요 신살</summary><div class="shensal-grid">${shens.length?shens.map(([n,d])=>`<div><b>${n}</b><span>${d}</span></div>`).join(''):'<div><b>두드러진 주요 신살 없음</b><span>신살보다 원국 구조와 오행·십신을 우선해서 봅니다.</span></div>'}</div><p class="small muted">신살은 유파마다 채택 범위가 다르므로, 앱은 천을귀인·문창귀인·건록·양인·도화·역마·화개·장성처럼 널리 쓰이는 항목만 보조적으로 표시합니다.</p></details>

      <details class="expert"><summary>격국 · 용신 후보</summary><div class="reasonbox"><b>자동 판정 원칙</b>격국과 용신은 유파와 판단법 차이가 커서 앱이 하나의 정답으로 확정하지 않습니다. 현재 오행 균형과 월령을 바탕으로는 <b>${strength.candidate.join('·')} 기운</b>을 우선 검토 후보로 제시합니다.</div><p class="small muted">전문 감정에서는 억부·조후·통관·병약·종격 여부 등을 함께 검토해야 합니다.</p></details>

      <details class="expert"><summary>전문 원국 표</summary>${advancedPillarTable(e,p)}<p class="small"><b>양력 환산</b> ${s.toYmd()} ${s.getHour?.()??''}:${pad(s.getMinute?.()??0)}<br><b>야자시 기준</b> ${p.sect==='1'?'23시를 다음날':'23시를 당일'}로 계산</p></details>
      <div class="notice-inline"><b>해석 원칙</b><span>사주·삼재·신살은 전통 해석 체계이며 과학적으로 미래를 확정하는 도구가 아닙니다. 중요한 결정은 현실 정보가 우선입니다.</span></div>`;
  }catch(err){$('#profileResult').hidden=false;$('#profileResult').innerHTML=`<p class="pillwarn">${err.message}</p>`}
}
function saveProfile(){
  const p={name:$('#name').value.trim()||'나',calendarType:$('#calendarType').value,gender:$('#gender').value,birthDate:$('#birthDate').value,birthTime:$('#birthTime').value||'12:00',timeKnown:$('#timeKnown').value,leapMonth:$('#leapMonth').checked,sect:$('#sect').value};
  if(!p.birthDate)return alert('생년월일을 입력하세요.');
  try{
    if(p.calendarType==='lunar'&&p.leapMonth){const {y,m}=ymd(p.birthDate),leap=LunarYear.fromYear(y).getLeapMonth();if(leap!==m)return alert(`${y}년의 윤달은 ${leap?leap+'월':'없음'}입니다.`)}
    solarFromProfile(p);saveLocal(p);renderHome();renderProfile();alert('저장하고 분석했습니다.');
  }catch(e){alert(e.message)}
}

function answer(){
  const p=profile(), q=$('#askText').value.trim(); if(!p)return alert('내 사주를 먼저 등록하세요.'); if(!q)return alert('질문을 입력하세요.');
  const c=classifyQuestion(q);
  try{
    const i=dayInfo(todayYmd(),p); let score=purposeScore(i,c.purpose); if(c.risky)score=Math.min(score,68); const ch=choice(score,c.risky);
    const basis=whyText(i,c.purpose);
    $('#askResult').hidden=false;
    $('#askResult').innerHTML=`<span class="badge">${c.type} 질문</span><div class="label" style="margin-top:12px">오늘의 선택</div><div class="big-choice ${ch.cls}">${ch.title}</div><p class="muted">${ch.sub}</p><div class="reasonbox"><b>현실 판단</b>${realityText(c.type,q,c.risky)}</div><div class="reasonbox"><b>오늘의 명리 흐름</b>${i.inter.text}. ${basis[1]||''}</div><div class="reasonbox"><b>추천 행동</b>${recommendationText(c.type,i,score,c.risky)}</div><details><summary>판단 근거 보기</summary><p class="small">${basis.join('<br>')}</p><p class="fade-note">내부 명리지수 ${score}/100. 성공확률이 아니라 전통 명리 규칙을 비교하기 위한 내부 참고값입니다.</p></details>`;
  }catch(e){alert(e.message)}
}

function findDates(){
  const p=profile(); if(!p)return alert('내 사주를 먼저 등록하세요.');
  const a=$('#fromDate').value,b=$('#toDate').value,purpose=$('#purpose').value; if(!a||!b||a>b)return alert('기간을 확인하세요.');
  const start=new Date(a+'T12:00'),end=new Date(b+'T12:00'); if((end-start)/864e5>90)return alert('한 번에 최대 90일까지 검색합니다.');
  const arr=[];
  for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
    const ds=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,i=dayInfo(ds,p);arr.push({ds,i,score:purposeScore(i,purpose)});
  }
  arr.sort((x,y)=>y.score-x.score);
  $('#dateResults').hidden=false;
  $('#dateResults').innerHTML=`<h2>${purpose} 추천일</h2><p class="muted small">점수보다 등급과 이유를 먼저 보세요. 실제 일정·비용·상대방 사정이 우선입니다.</p>${arr.slice(0,7).map((x,n)=>{const g=grade(x.score),why=whyText(x.i,purpose),acts=translateActs(x.i.yi,3);return `<div class="date-card"><div class="rank">${n+1}위 · ${ganzhiKo(x.i.ec.getDay())}</div><div class="date">${formatDateKo(x.ds)}</div><span class="grade-pill ${g.cls}">${g.label}</span> <span class="stars">${g.stars}</span><div class="why" style="margin-top:10px"><b>왜 추천하나요?</b><br>${why.slice(0,3).join('<br>')}</div>${acts.length?`<div class="why" style="margin-top:8px"><b>전통력의 생활 항목</b><br>${acts.join(' · ')}</div>`:''}<details><summary>전문 정보</summary><p class="small">일진 ${ganzhiKo(x.i.ec.getDay())} · ${x.i.inter.type} · 일간 관계 ${x.i.rel}<br>내부 명리지수 ${x.score}/100</p></details></div>`}).join('')}`;
}

function match(){
  const p=profile(),ob=$('#otherBirth').value; if(!p)return alert('내 사주를 먼저 등록하세요.'); if(!ob)return alert('상대 생년월일을 입력하세요.');
  try{
    const e1=ecFromSolar(solarFromProfile(p),p),{y,m,d}=ymd(ob),[h,mi]=($('#otherTime').value||'12:00').split(':').map(Number),e2=Solar.fromYmdHms(y,m,d,h,mi,0).getLunar().getEightChar();
    const inter=interaction(e1.getDayZhi(),e2.getDayZhi()),a=ELS[e1.getDayGan()],b=ELS[e2.getDayGan()];
    const rel=a===b?'서로 비슷한 속도와 기준을 느끼기 쉬운 관계':GEN[a]===b?'내 표현이나 행동이 상대에게 자극이 되기 쉬운 관계':GEN[b]===a?'상대의 말과 행동에서 도움을 받는 느낌이 생기기 쉬운 관계':CTRL[a]===b?'내가 기준이나 방향을 잡으려는 모습이 강해질 수 있는 관계':CTRL[b]===a?'상대의 기준이나 요구를 강하게 느낄 수 있는 관계':'서로 다른 방식을 보완할 수 있는 관계';
    const tip=inter.type==='충'?'의견이 어긋날 때 즉답으로 결론내기보다 시간을 조금 두고 다시 확인하세요.':inter.type==='합'?'함께 정하는 일은 역할과 마감 기준을 분명히 하면 협업의 장점이 살아납니다.':'상대 마음을 추측하기보다 구체적으로 묻고 확인하는 방식이 가장 실용적입니다.';
    $('#matchResult').hidden=false;
    $('#matchResult').innerHTML=`<h2>${p.name||'나'} × ${$('#otherName').value||'상대'}</h2><div class="reasonbox"><b>관계의 핵심</b>${inter.text}</div><div class="reasonbox"><b>서로의 리듬</b>${rel}</div><div class="reasonbox"><b>생활 팁</b>${tip}</div><details><summary>전문 명리 정보 보기</summary><p class="small">일주 ${ganzhiKo(e1.getDay())} × ${ganzhiKo(e2.getDay())}<br>일지 관계 ${inter.type}<br>일간 오행 ${a} × ${b}</p></details><p class="fade-note">궁합은 관계의 우열이나 미래를 확정하는 값이 아닙니다.</p>`;
  }catch(e){alert(e.message)}
}

function setScreen(id){
  $$('.screen').forEach(s=>s.classList.remove('active')); $('#'+id).classList.add('active');
  $$('.nav button').forEach(x=>x.classList.toggle('active',x.dataset.screen===id));
  document.body.dataset.screen=id;
  if(id==='profile')renderProfile();
  window.scrollTo({top:0,behavior:'smooth'});
}

function setup(){
  const now=new Date(),to=new Date(now);to.setDate(to.getDate()+21);
  $('#fromDate').value=todayYmd(); $('#toDate').value=`${to.getFullYear()}-${pad(to.getMonth()+1)}-${pad(to.getDate())}`;
  $$('.nav button').forEach(b=>b.onclick=()=>setScreen(b.dataset.screen));
  $('#calendarType').onchange=()=>$('#lunarExtra').hidden=$('#calendarType').value!=='lunar';
  $('#saveBtn').onclick=saveProfile; $('#askBtn').onclick=answer; $('#dateBtn').onclick=findDates; $('#matchBtn').onclick=match;
  $$('[data-q]').forEach(b=>b.onclick=()=>$('#askText').value=b.dataset.q);
  $('#backupBtn').onclick=()=>{const blob=new Blob([JSON.stringify({version:4,profile:profile()},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='오늘결_백업.json';a.click();URL.revokeObjectURL(a.href)};
  $('#restoreFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o.profile)throw Error();saveLocal(o.profile);renderHome();renderProfile();alert('복원되었습니다.')}catch{alert('올바른 백업 파일이 아닙니다.')}};r.readAsText(f)};
  $('#resetBtn').onclick=()=>{if(confirm('저장된 프로필을 모두 삭제할까요?')){localStorage.removeItem(STORE);location.reload()}};
  let deferred;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('#installBtn').hidden=false});
  $('#installBtn').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;$('#installBtn').hidden=true}};
  renderHome();renderProfile();loadEngine();
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
document.addEventListener('DOMContentLoaded',setup);

// ===== 오늘결 5.0 · 쉬운말 중심 최종 UX =====
function showProfileTab(id){
  $$('.profile-tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));
  $$('.profile-panel').forEach(x=>x.classList.toggle('active',x.id==='pt-'+id));
}
function currentLuckData(ec,p,nowYear){
  try{
    const yun=ec.getYun(p.gender==='male'?1:0,2), all=yun.getDaYun().slice(1,12);
    const rows=all.map(x=>({sy:Number(safeCall(x,'getStartYear')||0),ey:Number(safeCall(x,'getEndYear')||0),sa:safeCall(x,'getStartAge')??'',ea:safeCall(x,'getEndAge')??'',gz:safeCall(x,'getGanZhi')||''}));
    return {cur:rows.find(r=>r.sy<=nowYear&&r.ey>=nowYear),next:rows.find(r=>r.sy>nowYear),start:safeCall(yun,'getStartSolar')};
  }catch{return {cur:null,next:null,start:null}}
}
function relationPlain(rel){return {지원:'도움과 회복을 받아들이는 흐름',표현:'말·실행·결과를 밖으로 내는 흐름',동질:'내 방식과 속도를 유지하기 쉬운 흐름',관리:'돈·일·조건을 정리하고 관리하는 흐름',압박:'책임이나 요구가 크게 느껴질 수 있는 흐름',중립:'운보다 현실 조건이 더 중요한 흐름'}[rel]||'현실 조건을 우선하는 흐름'}
function monthlyLuckRows(ec,startDate=new Date()){
  const out=[],dg=ec.getDayGan(),dz=ec.getDayZhi();
  for(let k=0;k<12;k++){
    const d=new Date(startDate.getFullYear(),startDate.getMonth()+k,15,12,0,0),y=d.getFullYear(),m=d.getMonth()+1;
    const me=Solar.fromYmdHms(y,m,15,12,0,0).getLunar().getEightChar();
    const rel=relation(dg,me.getMonthGan()),inter=interaction(dz,me.getMonthZhi());
    let s=70+({지원:8,표현:5,동질:4,관리:2,압박:-7,중립:0}[rel]||0)+(inter.type==='합'?9:inter.type==='충'?-10:0);
    s=Math.max(45,Math.min(92,s));
    const g=grade(s);
    out.push({y,m,gz:ganzhiKo(me.getMonth()),rel,inter,g});
  }
  return out;
}
function monthlyLuckHtml(ec){
  const rows=monthlyLuckRows(ec);
  return `<div class="month-strip">${rows.map((r,i)=>`<div class="month-tile ${i===0?'current':''}"><span>${r.y}.${r.m}</span><b>${r.g.label}</b><small>${r.gz}월 · ${r.rel}${r.inter.type!=='평'?` · ${r.inter.type}`:''}</small></div>`).join('')}</div>`;
}
function lifeGuideHtml(ec,c,dm){
  const high=[...Object.entries(c)].sort((a,b)=>b[1]-a[1])[0][0], low=[...Object.entries(c)].sort((a,b)=>a[1]-b[1])[0][0];
  const maps={
    甲:{work:'방향을 정하고 책임 있게 밀어가는 일',money:'큰 방향을 정한 뒤 계획적으로 관리',love:'신뢰와 약속이 분명한 관계',study:'장기 목표를 세워 누적하는 공부'},
    乙:{work:'조율·기획·사람 사이를 연결하는 일',money:'작은 지출 흐름을 세밀하게 관리',love:'대화가 부드럽고 배려가 오가는 관계',study:'연결해서 이해하고 정리하는 공부'},
    丙:{work:'표현·영업·리더십·콘텐츠처럼 드러내는 일',money:'속도보다 예산 한도를 먼저 정하기',love:'감정과 호감을 솔직히 나누는 관계',study:'짧게 집중하고 바로 써보는 공부'},
    丁:{work:'디테일·교육·상담·기획처럼 집중이 필요한 일',money:'목적별로 나누어 관리',love:'가까운 사람과 깊게 신뢰를 쌓는 관계',study:'조용한 환경에서 깊게 파고드는 공부'},
    戊:{work:'관리·운영·기반을 지키는 역할',money:'안정성과 장기 계획을 중시',love:'꾸준하고 예측 가능한 관계',study:'기초부터 단계적으로 쌓는 공부'},
    己:{work:'실무·돌봄·품질관리·지원 역할',money:'생활비와 고정비를 꼼꼼히 관리',love:'생활 호흡과 배려가 맞는 관계',study:'반복하고 정리하면서 익히는 공부'},
    庚:{work:'문제해결·결단·기술·규칙이 분명한 일',money:'기준을 세우고 불필요한 지출을 정리',love:'솔직하고 경계가 분명한 관계',study:'문제풀이와 실전형 학습'},
    辛:{work:'품질·분석·디자인·정밀 업무',money:'비교하고 선택해 효율을 높이는 방식',love:'예의와 세심함을 중요하게 여기는 관계',study:'정확한 기준과 디테일을 익히는 공부'},
    壬:{work:'정보·이동·기획·새로운 기회를 연결하는 일',money:'기회가 많을수록 우선순위를 좁혀 관리',love:'자유를 존중하면서 대화가 잘 통하는 관계',study:'넓게 탐색한 뒤 핵심을 묶는 공부'},
    癸:{work:'분석·관찰·상담·정보 정리처럼 섬세한 일',money:'작은 흐름을 꾸준히 기록하고 관리',love:'정서적 안전감과 세심한 대화가 있는 관계',study:'자료를 모으고 깊게 이해하는 공부'}
  };
  const a=maps[ec.getDayGan()]||maps.壬;
  return `<div class="life-grid">
    <div class="life-card"><i>일</i><b>일·직업</b><p>${a.work}</p></div>
    <div class="life-card"><i>돈</i><b>재물관리</b><p>${a.money}</p></div>
    <div class="life-card"><i>인연</i><b>연애·관계</b><p>${a.love}</p></div>
    <div class="life-card"><i>공부</i><b>배움 방식</b><p>${a.study}</p></div>
  </div><div class="plain-note"><b>균형 팁</b> ${high} 기운이 상대적으로 강하고 ${low} 기운이 적게 보입니다. 강한 기운을 억지로 없애기보다, 부족한 ${low} 기운의 방식도 생활에 조금씩 섞는다는 관점으로 보세요.</div>`;
}
function turningPointHtml(ec,p,nowYear){
  const ld=currentLuckData(ec,p,nowYear),sj=samjaeInfo(ec.getYearZhi(),nowYear);
  let yearEvent=null;
  for(let y=nowYear+1;y<=nowYear+12;y++){
    const it=interaction(ec.getDayZhi(),yearBranch(y)); if(it.type!=='평'){yearEvent={y,type:it.type};break}
  }
  return `<div class="turn-list">
    <div><span>지금</span><b>${ld.cur?`${ganzhiKo(ld.cur.gz)} 대운`: '현재 대운 계산'}</b><p>${ld.cur?`${ld.cur.sa}~${ld.cur.ea}세 · ${ld.cur.sy}~${ld.cur.ey}년`:'출생정보를 기준으로 계산합니다.'}</p></div>
    <div><span>다음 큰 전환</span><b>${ld.next?`${ld.next.sy}년경`:'—'}</b><p>${ld.next?`${ganzhiKo(ld.next.gz)} 대운으로 전환`:'다음 대운 정보 확인'}</p></div>
    <div><span>삼재</span><b>${sj?.current?sj.current.stage:'현재 삼재 아님'}</b><p>${sj?`다음 들삼재 ${sj.futureStart}년`:'띠 기준 별도 계산'}</p></div>
    <div><span>가까운 합·충 해</span><b>${yearEvent?`${yearEvent.y}년 · ${yearEvent.type}`:'12년 내 큰 신호 없음'}</b><p>일지와 해의 지지 관계를 단순 비교한 참고입니다.</p></div>
  </div>`;
}
function currentFlowHtml(ec,p,nowYear){
  const ld=currentLuckData(ec,p,nowYear),yG=yearGan(nowYear),yZ=yearBranch(nowYear),yr=relation(ec.getDayGan(),yG),yi=interaction(ec.getDayZhi(),yZ);
  const d=new Date(),me=Solar.fromYmdHms(d.getFullYear(),d.getMonth()+1,15,12,0,0).getLunar().getEightChar(),mr=relation(ec.getDayGan(),me.getMonthGan()),mi=interaction(ec.getDayZhi(),me.getMonthZhi());
  return `<div class="flow-now">
    <div><span>10년 흐름 · 대운</span><strong>${ld.cur?ganzhiKo(ld.cur.gz):'계산 중'}</strong><p>${ld.cur?`${ld.cur.sy}~${ld.cur.ey}년, ${ld.cur.sa}~${ld.cur.ea}세`:'—'}</p></div>
    <div><span>${nowYear}년 · 세운</span><strong>${yearGanzhiKo(nowYear)}년</strong><p>${relationPlain(yr)}${yi.type!=='평'?` · 일지 ${yi.type}`:''}</p></div>
    <div><span>${d.getMonth()+1}월 · 월운</span><strong>${ganzhiKo(me.getMonth())}월</strong><p>${relationPlain(mr)}${mi.type!=='평'?` · 일지 ${mi.type}`:''}</p></div>
  </div>`;
}
function easyShensalHtml(shens){
  if(!shens.length)return '<div class="plain-note">두드러진 주요 신살보다 원국의 오행·십신·대운 흐름을 우선해서 보는 편이 좋습니다.</div>';
  return `<div class="easy-tags">${shens.map(([n,d])=>`<div><b>${n}</b><span>${d}</span></div>`).join('')}</div>`;
}
function renderProfile(){
  const p=profile(); if(!p)return;
  ['name','birthDate','birthTime','gender','calendarType','timeKnown','sect'].forEach(id=>{if($('#'+id)&&p[id]!=null)$('#'+id).value=p[id]});
  $('#leapMonth').checked=!!p.leapMonth; $('#lunarExtra').hidden=p.calendarType!=='lunar';
  try{
    const s=solarFromProfile(p),e=ecFromSolar(s,p),c=countElements(e,p),total=Object.values(c).reduce((a,b)=>a+b,0),dm=DAYMASTER[e.getDayGan()]||{};
    const entries=Object.entries(c),sorted=[...entries].sort((a,b)=>b[1]-a[1]),high=sorted[0],minVal=Math.min(...entries.map(x=>x[1])),lowEls=entries.filter(x=>x[1]===minVal).map(x=>x[0]),need=lowEls[0],comp=COMPLEMENT[need],nowYear=new Date().getFullYear();
    const pillars=[['년주',e.getYear()],['월주',e.getMonth()],['일주',e.getDay()],['시주',p.timeKnown==='unknown'?'미상':e.getTime()]],rels=branchRelations(pillars),shens=shensalList(e,p),strength=strengthHint(c,e),animal=zhiAnimal(e.getYear());
    const summary=`${dm.name||ganzhiKo(e.getDayGan())} 일간. ${high[0]} 기운이 가장 두드러지고 ${lowEls.join('·')} 기운이 가장 적게 보입니다.`;
    $('#profileResult').hidden=false;
    $('#profileResult').innerHTML=`
      <div class="saju-dashboard-hero"><span>${p.name||'나'}의 사주 한눈에</span><h2>${dm.name||ganzhiKo(e.getDayGan())} · ${dm.symbol||''}</h2><p>${dm.summary||''}</p><div class="hero-mini"><b>${animal||''}</b><b>${strength.label}</b><b>보완 ${need}</b></div></div>
      <div class="profile-tabs"><button class="profile-tab active" data-tab="easy" onclick="showProfileTab('easy')">쉬운 풀이</button><button class="profile-tab" data-tab="flow" onclick="showProfileTab('flow')">운의 흐름</button><button class="profile-tab" data-tab="match" onclick="showProfileTab('match')">인연·궁합</button><button class="profile-tab" data-tab="expert" onclick="showProfileTab('expert')">전문 만세력</button></div>

      <div class="profile-panel active" id="pt-easy">
        <div class="plain-summary"><span>한 줄 요약</span><b>${summary}</b></div>
        <h3 class="friendly-title">나는 어떤 사람인가</h3><div class="trait-list">${(dm.traits||[]).map(t=>`<div>${t}</div>`).join('')}</div>
        <h3 class="friendly-title">생활 분야별 사용설명서</h3>${lifeGuideHtml(e,c,dm)}
        <h3 class="friendly-title">내 오행 균형</h3>${entries.map(([k,v])=>{const pct=Math.round(v/total*100);return `<div class="element-row"><b>${k}</b><div class="element-track"><div class="element-fill el-${k}" style="width:${pct}%"></div></div><span>${pct}%</span></div>`}).join('')}
        <div class="plain-note"><b>쉽게 보면</b> 오행은 점수표가 아니라 다섯 가지 성향을 어떻게 쓰는지 보는 참고입니다. ${need}이 적다고 해서 나쁘다는 뜻은 아닙니다.</div>
        <h3 class="friendly-title">내 사주팔자</h3><div class="pillargrid full-pillargrid">${pillars.map(([l,v])=>`<div class="pillar"><span>${l}</span><b>${v==='미상'?'미상':ganzhiKo(v)}</b><small>${v==='미상'?'출생시간 미상':`${ELS[v[0]]||''} · ${ELS[v[1]]||''}`}</small></div>`).join('')}</div>
      </div>

      <div class="profile-panel" id="pt-flow">
        <h3 class="friendly-title">지금 내 운은 어디쯤?</h3>${currentFlowHtml(e,p,nowYear)}
        <h3 class="friendly-title">인생의 큰 변곡점</h3>${turningPointHtml(e,p,nowYear)}
        <h3 class="friendly-title">대운 · 10년 단위 큰 흐름</h3><p class="guide-copy">대운은 인생의 계절처럼 약 10년 단위로 바뀌는 큰 흐름입니다. 좋고 나쁨을 확정하기보다 어떤 주제가 강해지는지 보는 용도입니다.</p>${luckTimeline(e,p,nowYear)}
        <h3 class="friendly-title">삼재</h3><p class="guide-copy">삼재는 사주 전체가 아니라 태어난 해의 띠로 보는 별도의 민간 전통입니다.</p>${samjaeHtml(e,nowYear)}
        <h3 class="friendly-title">앞으로 12개월</h3>${monthlyLuckHtml(e)}
        <h3 class="friendly-title">앞으로 10년</h3>${annualLuckHtml(e,p,nowYear)}
      </div>

      <div class="profile-panel" id="pt-match">
        <div class="compat-card"><span class="badge">오행 보완 관점</span><h3>나와 다른 기운을 채워주는 사람</h3><div class="need-element"><span>현재 가장 적은 기운</span><strong>${need}</strong></div><p>${need} 기운이 상대적으로 적게 보입니다. 관계에서는 나와 똑같은 사람보다 내가 덜 쓰는 방식이 자연스러운 사람이 균형을 줄 수 있다는 관점으로 참고하세요.</p><div class="compat-grid"><div><span>보완 생월 참고</span><strong>${comp?comp.months.map(x=>x+'월').join(' · '):'—'}</strong><small>${comp?`대표 ${comp.best}월생`:'—'}</small></div><div><span>보완 띠 참고</span><strong>${comp?comp.zodiacs.join(' · '):'—'}</strong><small>${comp?`대표 ${comp.bestZodiac}`:'—'}</small></div></div><div class="plain-note"><b>중요</b> 생월과 띠만으로 궁합을 정하지 않습니다. 실제 궁합은 상대의 년·월·일·시 전체를 입력해 ‘우리 둘’에서 비교하세요.</div></div>
        <h3 class="friendly-title">관계에서 보이는 내 기본 리듬</h3><div class="trait-list"><div>${dm.traits?.[0]||'내 일간을 중심으로 관계 방식을 봅니다.'}</div><div>${dm.traits?.[1]||'상대와의 차이를 합·충·오행 관계로 비교합니다.'}</div></div>
        <h3 class="friendly-title">내 사주에서 보이는 주요 관계 신호</h3>${easyShensalHtml(shens)}
      </div>

      <div class="profile-panel" id="pt-expert">
        <div class="expert-warning"><b>전문가용 보기</b><span>아래부터는 명리 용어를 그대로 확인하는 영역입니다. 처음 보는 분은 ‘쉬운 풀이’와 ‘운의 흐름’만 봐도 충분합니다.</span></div>
        <details class="expert" open><summary>원국 · 지장간 · 십신</summary>${hiddenStemHtml(e,p)}${advancedPillarTable(e,p)}</details>
        <details class="expert"><summary>합 · 충 · 형 · 파 · 해</summary><div class="stack">${rels.length?rels.map(x=>`<div>${x}</div>`).join(''):'<div>두드러진 자동 감지 조합이 없습니다.</div>'}</div></details>
        <details class="expert"><summary>주요 신살</summary><div class="shensal-grid">${shens.length?shens.map(([n,d])=>`<div><b>${n}</b><span>${d}</span></div>`).join(''):'<div><b>두드러진 주요 신살 없음</b><span>원국 구조를 우선합니다.</span></div>'}</div></details>
        <details class="expert"><summary>납음 · 십이운성 · 공망</summary>${advancedPillarTable(e,p)}</details>
        <details class="expert"><summary>격국 · 용신 참고</summary><div class="plain-note"><b>자동 확정하지 않습니다.</b> 현재 단순 균형 계산에서는 ${strength.candidate.join('·')} 기운을 검토 후보로 봅니다. 실제 용신은 월령·통근·투간·조후·통관·격국 등을 종합해야 합니다.</div></details>
        <details class="expert"><summary>계산 정보</summary><p class="small"><b>양력 환산</b> ${s.toYmd()} ${s.getHour?.()??''}:${pad(s.getMinute?.()??0)}<br><b>야자시</b> ${p.sect==='1'?'23시를 다음날':'23시를 당일'} 기준<br><b>출생지 진태양시</b> 미보정</p></details>
      </div>
      <div class="notice-inline"><b>해석 기준</b><span>사주는 전통 명리 해석을 정리한 참고 정보입니다. 건강·투자·법률·안전 등 중요한 판단은 객관적 정보와 전문가 판단을 우선하세요.</span></div>`;
  }catch(err){$('#profileResult').hidden=false;$('#profileResult').innerHTML=`<p class="pillwarn">${err.message}</p>`}
}

// ===== 오늘결 6.0 · 사람처럼 풀어주는 사주상담 모드 =====
const ELEMENT_TONE={
  목:{good:'성장하고 새 판을 짜는 힘',risk:'방향을 너무 많이 벌리는 것',use:'배우고 시작하고 사람을 넓히는 일'},
  화:{good:'표현하고 드러내며 관계를 데우는 힘',risk:'성급함과 과열',use:'발표·홍보·연애·대인관계·실행'},
  토:{good:'버티고 책임지고 생활을 안정시키는 힘',risk:'고집과 정체',use:'관리·저축·부동산·생활기반·정리'},
  금:{good:'기준을 세우고 잘라내며 완성도를 높이는 힘',risk:'말과 판단이 너무 단단해지는 것',use:'계약·판단·기술·품질·정리'},
  수:{good:'정보를 모으고 흐름을 읽고 유연하게 움직이는 힘',risk:'생각이 많아져 결정을 늦추는 것',use:'기획·정보·이동·상담·학습'}
};
function ageKoreanSimple(p,y){try{return y-ymd(p.birthDate).y+1}catch{return ''}}
function yearLuckData(ec,y){
  const g=yearGan(y),z=yearBranch(y),rel=relation(ec.getDayGan(),g),it=interaction(ec.getDayZhi(),z),yr=interaction(ec.getYearZhi(),z);
  let score=70+({지원:8,표현:6,동질:4,관리:3,압박:-7,중립:0}[rel]||0)+(it.type==='합'?9:it.type==='충'?-10:0)+(yr.type==='합'?4:yr.type==='충'?-4:0);
  score=Math.max(42,Math.min(94,score));
  return {y,g,z,rel,it,yr,score,grade:grade(score)};
}
function yearCounselText(ec,p,y){
  const d=yearLuckData(ec,y), el=ELS[d.g], t=ELEMENT_TONE[el], age=ageKoreanSimple(p,y);
  const intro=d.it.type==='합'?'이 해는 사람·일·기회가 연결되기 쉬운 편입니다. 막혀 있던 관계나 일이 다시 이어지거나, 혼자 하던 일을 누군가와 함께 풀어가기 좋은 흐름으로 봅니다.':d.it.type==='충'?'이 해는 변화와 조정이 눈에 띄는 편입니다. 직장·관계·생활패턴 중 하나가 흔들리거나 바뀔 수 있으니, 무조건 지키려 하기보다 바뀌는 상황에 맞춰 움직이는 편이 좋습니다.':'큰 충돌보다 내 선택과 준비가 결과를 좌우하는 해입니다. 평소 해오던 일을 정리하고 필요한 것을 하나씩 쌓아가는 사람이 유리합니다.';
  const rel={지원:'도움을 받거나 회복할 여지가 커지는 흐름입니다. 혼자 다 해결하려 하기보다 도움을 받아들이고, 필요한 사람에게 먼저 연락하는 편이 좋습니다.',표현:'그동안 준비한 것을 밖으로 보여주고 결과를 만드는 흐름입니다. 말·발표·실행·홍보처럼 밖으로 드러내는 행동이 중요해집니다.',동질:'내 방식대로 밀고 가기 쉬운 해입니다. 자신감은 좋지만 같은 방식만 고집하지 않는 게 중요합니다. 주변 의견을 한 번 듣고 결정하면 실수가 줄어듭니다.',관리:'돈·일·조건·책임을 정리하는 일이 중요해지는 해입니다. 숫자, 계약, 일정, 고정비를 꼼꼼히 보면 유리합니다.',압박:'책임과 요구가 늘어날 수 있습니다. 무조건 버티기보다 우선순위를 정하고 부담을 나누는 것이 중요합니다. 몸과 마음이 지치기 전에 쉬는 시간을 먼저 확보하세요.',중립:'특정 운보다 현실적인 준비와 선택이 더 중요한 해입니다. 큰 승부보다 생활의 기본을 잘 지키는 것이 결과를 만듭니다.'}[d.rel];
  const work={지원:'사람의 도움을 받아 일이 풀릴 수 있습니다. 부탁할 것은 부탁하고, 혼자 끌어안지 않는 것이 좋습니다.',표현:'내가 준비한 것을 보여주기 좋은 해입니다. 보고·발표·면접·홍보·새 프로젝트처럼 밖으로 드러나는 일이 잘 맞습니다.',동질:'주도권을 잡기 쉽습니다. 다만 동료와 경쟁이 과해지지 않도록 조율이 필요합니다.',관리:'계약·실적·돈·책임처럼 결과가 숫자로 남는 일에 신경 쓰는 해입니다. 문서 확인을 꼼꼼히 하세요.',압박:'업무량과 책임이 늘 수 있습니다. 무리한 확장보다 우선순위와 휴식 관리가 중요합니다.',중립:'새것을 벌이기보다 해오던 일을 정리하고 완성하는 편이 좋습니다.'}[d.rel];
  const money=d.rel==='관리'?'돈의 흐름을 정리하기 좋은 해입니다. 고정비·대출·보험·저축을 한 번 점검하고, 큰돈은 계약 조건부터 확인하세요.':d.rel==='표현'?'일을 밖으로 드러내면서 수입 기회가 생길 수 있지만 지출도 같이 커질 수 있습니다. 벌 때보다 남길 때를 더 신경 쓰세요.':d.rel==='압박'?'예상하지 못한 지출이나 책임성 비용이 생길 수 있으니 현금 여유를 남겨두는 편이 좋습니다.':'큰 한 방보다 평소 돈 관리 습관이 중요합니다. 계획 없는 큰 지출만 피하면 무난합니다.';
  const relationText=d.it.type==='합'?'사람 사이에서는 풀리지 않던 이야기를 다시 꺼내기 좋습니다. 새로운 인연도 들어올 수 있지만, 급하게 깊어지기보다 자연스럽게 시간을 두세요.':d.it.type==='충'?'관계에서는 서운함이나 거리감이 생기기 쉬울 수 있습니다. 그날 감정으로 관계를 단정하지 말고, 중요한 말은 한 번 자고 다시 확인하는 것이 좋습니다.':'관계에서는 큰 사건보다 내가 어떤 태도로 대하느냐가 중요합니다. 먼저 안부를 묻고 약속을 지키는 기본이 힘을 발휘합니다.';
  const action=`${t?.use||'생활의 중요한 일'}에 힘을 쓰면 좋습니다. 반대로 ${t?.risk||'무리한 확장'}이 나타나지 않도록 한 번씩 속도를 조절하세요.`;
  return {d,headline:`${y}년${age?` · ${age}세`:''} — ${d.grade.label}`,intro,rel,work,money,relationText,action};
}
function annualCounselHtml(ec,p,fromYear){
  const rows=[];for(let y=fromYear;y<fromYear+10;y++)rows.push(yearCounselText(ec,p,y));
  return `<div class="future-years">${rows.map((x,i)=>`<article class="future-year ${i===0?'current':''}"><div class="fy-head"><span>${yearGanzhiKo(x.d.y)}년 · ${animalFromBranch(x.d.z)}</span><b>${x.headline}</b><em>${x.d.grade.label}</em></div><p><b>전체 흐름.</b> ${x.intro} ${x.rel}</p><p><b>일과 직장.</b> ${x.work}</p><p><b>돈.</b> ${x.money}</p><p><b>사람과 관계.</b> ${x.relationText}</p><div class="counsel-tip"><b>이 해를 보내는 법</b>${x.action}</div></article>`).join('')}</div>`;
}
function monthCounselDetail(ec,r){
  const base=relationPlain(r.rel);
  let overall='큰 사건보다 평소 습관과 준비가 결과를 만드는 달입니다.';
  let caution='일정을 너무 빽빽하게 잡지 말고, 중요한 약속과 지출은 한 번 더 확인하세요.';
  let good='미뤄둔 일 하나를 정리하거나 생활 리듬을 바로잡기에 좋습니다.';
  if(r.inter.type==='합'){overall='사람과 연결하고 미뤄둔 이야기를 풀기에 비교적 부드러운 달입니다.';good='연락·만남·협의·소개처럼 사람을 통해 일이 풀리는 행동을 해보세요.';caution='분위기가 좋다고 너무 빨리 약속하거나 큰 결정을 확정하지는 마세요.'}
  if(r.inter.type==='충'){overall='일정 변경이나 마음의 흔들림이 생기기 쉬운 달입니다.';good='정리·점검·수정처럼 바뀐 상황에 맞춰 다시 맞추는 일은 오히려 잘 맞습니다.';caution='계약·이직·큰 지출·관계 결론은 서두르지 말고 한 번 더 확인하세요.'}
  if(r.rel==='표현'){good='보고·발표·면접·소개·홍보처럼 밖으로 보여주는 일을 하기 좋습니다.';caution='말이 앞서거나 약속을 크게 잡지 않도록 주의하세요.'}
  if(r.rel==='관리'){good='돈·서류·계약·집안정리·고정비 점검처럼 현실적인 일을 처리하기 좋습니다.';caution='숫자와 문서에서 작은 실수가 생기지 않도록 마지막 확인을 하세요.'}
  if(r.rel==='압박'){caution='몸과 마음이 쉽게 지칠 수 있으니 무리한 일정, 감정적인 대화, 충동적인 결정은 줄이는 편이 좋습니다.';good='해야 할 일을 줄이고 중요한 것 한두 개에 집중하면 오히려 결과가 납니다.'}
  return {overall:`${base}. ${overall}`,good,caution};
}
function monthCounselHtml(ec){
  const rows=monthlyLuckRows(ec);
  return `<div class="month-counsel">${rows.map((r,i)=>{const t=monthCounselDetail(ec,r);return `<div class="mc-row ${i===0?'current':''}"><div><span>${r.y}년 ${r.m}월</span><b>${r.g.label}</b><small>${r.gz}월</small></div><p><b>이달 흐름.</b> ${t.overall}</p><p><b>하면 좋은 것.</b> ${t.good}</p><p><b>조심할 것.</b> ${t.caution}</p></div>`}).join('')}</div>`;
}
function 상담성향(ec,c,dm){
  const entries=Object.entries(c).sort((a,b)=>b[1]-a[1]), high=entries[0][0], low=entries[entries.length-1][0];
  const h=ELEMENT_TONE[high],l=ELEMENT_TONE[low];
  const dmText=(dm.traits||[]).slice(0,2).join(' 또 ');
  return `<div class="fortune-reader"><div class="reader-mark">오늘결 사주상담</div><p><b>먼저 이 사주의 중심부터 볼게요.</b> ${dm.name||''} 일간이라 ${dm.summary||''} ${dmText?dmText+'.':''}</p><p>여기에 <b>${high} 기운이 가장 많이</b> 보입니다. 그래서 ${h.good}을 생활에서 자주 쓰는 편으로 볼 수 있어요. 반대로 <b>${low} 기운은 상대적으로 적습니다.</b> 이것은 부족해서 나쁘다는 뜻이 아니라, ${l.good}을 의식적으로 보충하면 균형이 좋아진다는 뜻입니다.</p><p>사람을 볼 때도 이 부분이 중요합니다. 나와 똑같은 사람만 편한 것이 아니라, 내가 잘 쓰지 않는 ${low} 기운의 방식을 자연스럽게 쓰는 사람이 오히려 나를 편하게 만들어 줄 수 있습니다.</p><p class="reader-em"><b>쉽게 정리하면</b> 잘하는 것은 ${high}의 힘이고, 앞으로 의식적으로 키워야 할 것은 ${low}의 방식입니다. 사주에서는 이렇게 강한 것과 약한 것을 같이 보면서 사람의 균형을 설명합니다.</p></div>`;
}
function 분야상담(ec,c){
  const dg=ec.getDayGan();
  const base={
    甲:['일에서는 방향을 정하고 책임지는 자리에서 힘이 납니다. 사람을 이끄는 역할이나 긴 호흡의 프로젝트가 잘 맞습니다. 다만 모든 일을 혼자 책임지려 하지 마세요.','돈은 단기 승부보다 장기 계획이 맞습니다. 큰 지출은 목적과 기간을 정해두면 흔들림이 적습니다.','연애에서는 신뢰와 약속을 중요하게 봅니다. 상대가 애매하게 행동하면 답답함이 커질 수 있으니, 추측보다 직접 묻는 대화가 필요합니다.','가족에게 든든한 역할을 하려는 마음이 강합니다. 하지만 모든 문제를 내가 해결해야 한다고 생각하면 쉽게 지칠 수 있습니다.'],
    乙:['일에서는 사람 사이를 조율하고 연결할 때 강점이 납니다. 협업·기획·서비스처럼 관계를 다루는 일이 잘 맞습니다.','돈은 큰돈보다 작은 새는 돈을 막는 것이 중요합니다. 자동이체와 반복지출을 정리하면 효과가 큽니다.','연애에서는 부드러운 대화와 배려가 큰 힘입니다. 다만 상대에게 맞추기만 하다가 내 감정을 뒤늦게 터뜨리지 않도록 하세요.','가족 분위기를 많이 살피는 편입니다. 내 감정과 내 시간도 따로 챙겨야 오래 편합니다.'],
    丙:['일에서는 앞에 나서고 알리고 움직일 때 운이 살아납니다. 발표·영업·홍보·교육처럼 사람 앞에 서는 일이 맞습니다.','돈은 들어오는 속도만큼 나가는 속도도 빠를 수 있습니다. 기분 좋을 때 큰 지출을 결정하지 않는 습관이 중요합니다.','연애에서는 표현을 아끼지 않을수록 관계가 선명해집니다. 대신 감정이 뜨거울 때 바로 결론내리는 것은 피하세요.','가족에게 따뜻하고 적극적이지만, 감정이 올라왔을 때 말이 앞서지 않도록 한 템포 쉬는 것이 좋습니다.'],
    丁:['일에서는 집중·교육·기획·상담처럼 섬세함이 필요한 곳이 맞습니다. 작은 차이를 잘 보는 능력이 장점입니다.','돈은 목적별로 나눠 관리하면 안정적입니다. 한 통장에 다 섞기보다 용도를 나누는 방식이 잘 맞습니다.','연애에서는 깊고 조용한 신뢰를 중요하게 여깁니다. 상대가 내 마음을 알아주길 기다리기보다 필요한 말은 직접 하는 편이 좋습니다.','가족에게 정성을 많이 쓰는 만큼 서운함도 오래 담지 않는 게 좋습니다.'],
    戊:['일에서는 운영·관리·책임을 맡을 때 강합니다. 조직을 안정시키고 기준을 세우는 역할이 잘 맞습니다.','돈은 안정성과 축적을 중시하는 방식이 맞습니다. 무리한 단기 승부보다 꾸준히 쌓는 방식이 유리합니다.','관계에서는 꾸준함이 가장 큰 장점입니다. 다만 한번 정한 생각을 너무 오래 고집하면 상대가 답답할 수 있습니다.','가족을 지키려는 마음이 강하지만 변화가 필요할 때 너무 오래 버티지 마세요.'],
    己:['일에서는 실무·관리·돌봄·품질을 챙기는 역할이 잘 맞습니다. 남들이 놓치는 것을 잘 챙기는 힘이 있습니다.','돈은 생활비와 고정비 관리가 핵심입니다. 작은 지출을 정리하는 것만으로도 안정감이 커집니다.','관계에서는 서로 챙겨주는 생활 호흡이 중요합니다. 말보다 행동에서 애정을 느끼는 편입니다.','가족 일을 많이 떠맡기 쉬우니 내 몫과 남의 몫을 구분하세요.'],
    庚:['일에서는 결단·문제 해결·기술·규칙이 있는 분야에서 힘이 납니다. 위기 때 판단이 빠른 편입니다.','돈은 기준을 세우고 불필요한 것을 줄이는 방식이 맞습니다. 애매한 투자나 계약은 싫어하는 편이 안정에 도움이 됩니다.','연애에서는 솔직함이 장점이지만 표현이 차갑게 들리지 않게 하는 것이 중요합니다.','가족에게 해결사 역할을 하기 쉬우나 모든 문제를 직접 해결할 필요는 없습니다.'],
    辛:['일에서는 분석·정밀·품질·디자인처럼 완성도를 요구하는 분야에 강합니다.','돈은 비교하고 고른 뒤 쓰는 방식이 맞습니다. 충동구매보다 오래 쓰는 것을 고르는 편입니다.','연애에서는 예의·세심함·신뢰를 중요하게 봅니다. 사소한 무례에도 마음이 멀어질 수 있으니 대화로 확인하세요.','가족의 작은 변화도 잘 알아차리는 만큼 완벽을 요구하지 않는 것이 좋습니다.'],
    壬:['일에서는 정보·기획·이동·새로운 기회를 연결하는 분야가 맞습니다. 변화가 있는 환경에서 강점이 납니다.','돈은 기회가 많을수록 선택을 줄이는 것이 중요합니다. 이것저것 손대기보다 한두 가지를 정해 관리하세요.','연애에서는 자유와 대화가 함께 있어야 오래 갑니다. 지나친 통제나 답답한 관계에서는 쉽게 피로해질 수 있습니다.','가족과도 지나친 간섭보다 서로 숨 쉴 공간이 있을 때 편합니다.'],
    癸:['일에서는 분석·관찰·상담·정보 정리처럼 섬세한 분야가 잘 맞습니다. 사람과 상황을 먼저 읽고 움직이는 힘이 있습니다.','돈은 큰 한 방보다 작은 흐름을 기록하고 관리할수록 안정됩니다. 생활비와 반복지출을 눈으로 확인하는 습관이 좋습니다.','연애에서는 정서적 안전감과 세심한 대화가 중요합니다. 말하지 않고 알아주길 기다리기보다 내 마음을 조금씩 표현하세요.','가족의 분위기를 많이 읽는 편이라 혼자 속으로 정리하지 말고 필요한 말은 표현하는 게 좋습니다.']
  }[dg]||[];
  const labels=['직업·일','재물','연애·부부','가족·인간관계'];
  return `<div class="consult-grid">${labels.map((l,i)=>`<div><span>${l}</span><p>${base[i]||'전체 사주 흐름과 함께 살펴봅니다.'}</p></div>`).join('')}</div>`;
}
function currentCounselHtml(ec,p,nowYear){
  const ld=currentLuckData(ec,p,nowYear), y=yearCounselText(ec,p,nowYear), next=yearCounselText(ec,p,nowYear+1), sj=samjaeInfo(ec.getYearZhi(),nowYear);
  const da=ld.cur?`${ganzhiKo(ld.cur.gz)} 대운`:'현재 대운';
  const dgan=ld.cur?.gz?.[0], del=dgan?ELS[dgan]:null;
  const startText=ld.rows?.[0]?`${ld.rows[0].sy}년, 약 ${ld.rows[0].sa}세부터 첫 대운이 시작됩니다.`:'첫 대운 시작 시점은 출생정보와 절기 기준으로 계산합니다.';
  const currentText=ld.cur?`현재는 ${ld.cur.sy}년부터 ${ld.cur.ey}년까지 이어지는 ${ganzhiKo(ld.cur.gz)} 대운에 들어와 있습니다. 나이로는 약 ${ld.cur.sa}세부터 ${ld.cur.ea}세까지의 큰 흐름입니다.`:'현재 대운 구간을 확인하는 중입니다.';
  const nextText=ld.next?`다음 큰 전환은 ${ld.next.sy}년경입니다. 그때부터 ${ganzhiKo(ld.next.gz)} 대운으로 넘어가면서 10년 동안 중요하게 느끼는 주제와 부담의 종류가 조금 달라질 수 있습니다.`:'다음 대운 전환 시점을 계산합니다.';
  const daTalk=del?`지금 10년 흐름에는 ${del} 기운이 들어와 있습니다. 쉽게 말하면 ${ELEMENT_TONE[del].good}을 쓰는 시기입니다. 그래서 ${ELEMENT_TONE[del].use} 같은 일에 힘을 주면 흐름을 활용하기 좋습니다. 반대로 ${ELEMENT_TONE[del].risk}이 심해지지 않도록 속도를 조절해야 합니다.`:'현재 대운의 큰 주제를 확인하는 구간입니다.';
  const sam=sj?.current?`현재 ${sj.current.stage}에 해당합니다. ${sj.cycle.map(x=>`${x.year}년 ${x.stage}`).join(', ')} 순서로 지나갑니다. 다만 삼재는 띠로만 보는 민간 전통이라 이것 하나로 좋은 해·나쁜 해를 단정하지 않습니다.`:`현재는 삼재가 아닙니다. 다음 들삼재는 ${sj?.futureStart||'계산'}년부터 시작하며, ${sj?.future?.map(x=>`${x.year}년 ${x.stage}`).join(', ')||''} 순서로 3년을 봅니다.`;
  return `<div class="reader-session long-read"><h3>지금부터 앞으로의 흐름을 차근차근 볼게요</h3><p><b>대운은 언제부터 시작되나요?</b><br>${startText}</p><p><b>지금은 어떤 대운인가요?</b><br>${currentText} ${daTalk}</p><p><b>다음 대운은 언제 바뀌나요?</b><br>${nextText}</p><p><b>${nowYear}년 올해 운은 어떤가요?</b><br>${y.intro} ${y.rel} ${y.work} ${y.money} ${y.relationText}</p><p><b>${nowYear+1}년은 미리 보면 어떤가요?</b><br>${next.intro} ${next.rel} ${next.action}</p><p><b>삼재는 언제인가요?</b><br>${sam}</p></div>`;
}
function timingAdviceHtml(ec,p,nowYear){
  const years=[];for(let y=nowYear;y<nowYear+12;y++)years.push(yearCounselText(ec,p,y));
  const good=[...years].sort((a,b)=>b.d.score-a.d.score).slice(0,3),care=[...years].sort((a,b)=>a.d.score-b.d.score).slice(0,3);
  return `<div class="timing-pair"><div><span>특히 힘을 써보기 좋은 해</span>${good.map((x,i)=>`<article class="timing-detail"><b>${i+1}순위 · ${x.d.y}년 · ${x.d.grade.label}</b><p>${x.intro} ${x.rel}</p><p><strong>추천:</strong> ${x.action}</p></article>`).join('')}</div><div><span>특히 한 번 더 확인할 해</span>${care.map((x,i)=>`<article class="timing-detail"><b>${x.d.y}년 · ${x.d.grade.label}</b><p>${x.intro} ${x.rel}</p><p><strong>주의:</strong> ${x.d.it.type==='충'?'이직·계약·큰 지출·관계 결론처럼 되돌리기 어려운 선택은 서두르지 마세요.':'무리한 확장보다 일정과 돈, 체력을 먼저 점검하세요.'}</p></article>`).join('')}</div></div>`;
}
function 상담신살(shens){
  if(!shens.length)return `<div class="fortune-reader"><p>신살은 두드러진 것보다 원국·오행·대운을 우선해서 보는 편이 맞습니다. 신살이 적다고 운이 약한 것도 아니고, 많다고 특별히 좋거나 나쁜 것도 아닙니다.</p></div>`;
  return `<div class="fortune-reader"><p><b>신살은 이름 때문에 겁먹을 필요가 없습니다.</b> 사주의 주인공이 아니라 보조 표시입니다. 원국·대운·세운을 본 뒤 참고하는 정도가 맞습니다.</p>${shens.map(([n,d])=>`<p><b>${n}</b> — ${d}. 실제 생활에서는 이 성향이 언제 강해지는지를 대운·세운과 같이 봅니다.</p>`).join('')}</div>`;
}
function 상담궁합(ec,c,need,comp,dm){
  const low=need;
  return `<div class="reader-session long-read"><h3>어떤 사람과 있으면 편할까요?</h3><p>당신은 ${dm.name||''}의 기본 리듬을 가지고 있고, 원국에서는 <b>${low} 기운이 상대적으로 적게</b> 보입니다. 그래서 나와 똑같은 성향만 가진 사람보다, 내가 잘 쓰지 않는 ${low}의 방식을 자연스럽게 쓰는 사람과 있을 때 균형감이 생길 수 있습니다.</p><p>오행 보완만 놓고 보면 <b>${comp?.zodiacs.join(' · ')||'상대 전체 사주 확인'}</b>와 <b>${comp?.months.map(x=>x+'월생').join(' · ')||'생월 전체 확인'}</b>을 참고할 수 있습니다. 그중 대표는 <b>${comp?.bestZodiac||'—'}</b>, 생월은 <b>${comp?.best||'—'}월</b>입니다.</p><p>다만 이것은 ‘이 띠면 무조건 잘 맞는다’는 뜻이 아닙니다. 실제 궁합은 두 사람의 일주·월주·오행·십신·합충을 함께 봐야 합니다. 띠가 잘 맞아도 생활방식이 다르면 힘들 수 있고, 띠가 충이어도 다른 기둥에서 서로 보완되면 편한 관계가 될 수 있습니다.</p><p class="reader-em"><b>쉽게 말하면</b> 보완 띠와 생월은 첫인상 정도의 참고이고, 실제 궁합은 두 사람의 사주 전체를 같이 봐야 합니다.</p></div>`;
}
function renderHome(){
  const p=profile();
  if(!p){$('#headline').textContent='생년월일시를 넣으면 오늘의 기운을 사주 상담하듯 풀어드립니다.';$('#homeMeta').innerHTML='';$('#metrics').innerHTML=['일','돈','관계','집중','이동','휴식'].map(x=>`<div class="metric"><span>${x}</span><b>—</b></div>`).join('');return;}
  try{
    const info=dayInfo(todayYmd(),p), e=ecFromSolar(solarFromProfile(p),p), now=new Date(), y=yearCounselText(e,p,now.getFullYear());
    const tone=info.inter.type==='합'?'오늘은 사람을 만나거나 말을 풀어내는 쪽이 비교적 자연스럽습니다.':info.inter.type==='충'?'오늘은 밀어붙이기보다 한 번 확인하고 움직이는 편이 좋습니다.':'오늘은 큰 승부보다 내 리듬을 잘 지키는 것이 중요한 날입니다.';
    $('#headline').textContent=tone;
    $('#homeMeta').innerHTML=`<span class="chip">오늘 ${ganzhiKo(info.ec.getDay())}</span><span class="chip">${now.getFullYear()}년 ${y.d.grade.label}</span><span class="chip">${info.rel} 흐름</span>`;
    const names=['일','돈','관계','집중','이동','휴식'],adj=[2,info.rel==='관리'?8:0,info.inter.type==='합'?10:info.inter.type==='충'?-9:0,info.rel==='압박'?-5:5,info.inter.type==='충'?-6:2,info.rel==='압박'?9:2];
    $('#metrics').innerHTML=names.map((x,i)=>`<div class="metric"><span>${x}</span><b>${grade(Math.max(40,Math.min(94,info.score+adj[i]))).label}</b></div>`).join('');
    const yi=translateActs(info.yi,3);$('#actions').innerHTML=(yi.length?yi:['가장 중요한 일 한 가지 먼저','상대 반응을 보며 대화','확정 전 한 번 더 확인']).map((x,i)=>`<div><b>${i+1}.</b> ${x}</div>`).join('');
    $('#todayBasis').innerHTML=`<div class="fortune-reader compact"><p><b>오늘만 놓고 보면</b> ${tone}</p><p>${whyText(info,'중요한 대화')[1]||''}</p><p><b>올해 큰 흐름까지 같이 보면</b> ${y.intro} ${y.rel}</p></div>`;
  }catch(e){$('#todayBasis').innerHTML=`<div class="pillwarn">${e.message}</div>`}
}
function renderProfile(){
  const p=profile(); if(!p)return;
  ['name','birthDate','birthTime','gender','calendarType','timeKnown','sect'].forEach(id=>{if($('#'+id)&&p[id]!=null)$('#'+id).value=p[id]});
  $('#leapMonth').checked=!!p.leapMonth; $('#lunarExtra').hidden=p.calendarType!=='lunar';
  try{
    const s=solarFromProfile(p),e=ecFromSolar(s,p),c=countElements(e,p),total=Object.values(c).reduce((a,b)=>a+b,0),dm=DAYMASTER[e.getDayGan()]||{},nowYear=new Date().getFullYear();
    const entries=Object.entries(c),sorted=[...entries].sort((a,b)=>b[1]-a[1]),high=sorted[0],minVal=Math.min(...entries.map(x=>x[1])),need=entries.find(x=>x[1]===minVal)?.[0]||'목',comp=COMPLEMENT[need],strength=strengthHint(c,e),pillars=[['년주',e.getYear()],['월주',e.getMonth()],['일주',e.getDay()],['시주',p.timeKnown==='unknown'?'미상':e.getTime()]],rels=branchRelations(pillars),shens=shensalList(e,p),animal=zhiAnimal(e.getYear());
    $('#profileResult').hidden=false;
    $('#profileResult').innerHTML=`
      <div class="consult-hero"><span>${p.name||'나'}의 사주상담</span><h2>${dm.name||ganzhiKo(e.getDayGan())} · ${dm.symbol||''}</h2><p>사주팔자를 숫자표가 아니라 실제 상담처럼 풀어서 보여드립니다.</p><div><b>${animal}</b><b>${strength.label}</b><b>${need} 기운 보완</b></div></div>
      <div class="profile-tabs"><button class="profile-tab active" data-tab="easy" onclick="showProfileTab('easy')">사주풀이</button><button class="profile-tab" data-tab="flow" onclick="showProfileTab('flow')">앞날운세</button><button class="profile-tab" data-tab="match" onclick="showProfileTab('match')">인연·궁합</button><button class="profile-tab" data-tab="expert" onclick="showProfileTab('expert')">전문 만세력</button></div>

      <div class="profile-panel active" id="pt-easy">
        ${상담성향(e,c,dm)}
        <h3 class="friendly-title">사주팔자 네 기둥</h3><div class="pillargrid full-pillargrid">${pillars.map(([l,v])=>`<div class="pillar"><span>${l}</span><b>${v==='미상'?'미상':ganzhiKo(v)}</b><small>${v==='미상'?'출생시간 미상':`${ELS[v[0]]}·${ELS[v[1]]}`}</small></div>`).join('')}</div>
        <div class="reader-session"><h3>네 기둥은 이렇게 봅니다</h3><p><b>년주</b>는 태어난 집안·초년의 배경을, <b>월주</b>는 사회생활과 성장 환경을, <b>일주</b>는 나 자신과 배우자 자리를, <b>시주</b>는 후반의 관심과 결과·자녀 자리를 참고해서 봅니다. 어느 한 기둥만 떼어 좋고 나쁘다고 말하지 않습니다.</p></div>
        <h3 class="friendly-title">오행을 사람 말로 풀면</h3>${entries.map(([k,v])=>{const pct=Math.round(v/total*100);return `<div class="element-row"><b>${k}</b><div class="element-track"><div class="element-fill el-${k}" style="width:${pct}%"></div></div><span>${pct}%</span></div>`}).join('')}<div class="reader-session"><p><b>${high[0]}이 가장 강하게 보입니다.</b> ${ELEMENT_TONE[high[0]].good}을 잘 쓰는 편입니다.</p><p><b>${need}이 가장 적습니다.</b> ${ELEMENT_TONE[need].good}을 의식적으로 생활에 넣어주면 균형 잡는 데 도움이 됩니다.</p></div>
        <h3 class="friendly-title">일·돈·연애·가족</h3>${분야상담(e,c)}
        <h3 class="friendly-title">이 사주에서 조심할 점</h3><div class="reader-session"><p>${ELEMENT_TONE[high[0]].risk}을 특히 조절하세요. 잘하는 기운이 지나치면 장점이 그대로 피로가 될 수 있습니다.</p><p>반대로 ${need} 기운을 보완한다는 건 특별한 부적이나 행동이 아니라, ${ELEMENT_TONE[need].use} 같은 생활 방식을 조금 더 써보라는 뜻으로 이해하면 쉽습니다.</p></div>
        <h3 class="friendly-title">귀인·신살은 이렇게 보면 됩니다</h3>${상담신살(shens)}
      </div>

      <div class="profile-panel" id="pt-flow">
        ${currentCounselHtml(e,p,nowYear)}
        <h3 class="friendly-title">큰 운 · 대운</h3><p class="guide-copy">대운은 약 10년 단위로 바뀌는 인생의 큰 계절입니다. 같은 사람도 어느 대운에 있느냐에 따라 관심사와 부담이 달라질 수 있습니다.</p>${luckTimeline(e,p,nowYear)}
        <h3 class="friendly-title">언제 힘을 쓰고, 언제 확인할까</h3>${timingAdviceHtml(e,p,nowYear)}
        <h3 class="friendly-title">앞으로 10년을 해마다 쉽게</h3>${annualCounselHtml(e,p,nowYear)}
        <h3 class="friendly-title">앞으로 12개월</h3>${monthCounselHtml(e)}
        <h3 class="friendly-title">삼재</h3>${samjaeHtml(e,nowYear)}
        <div class="reader-session"><p><b>삼재 때문에 겁먹지는 마세요.</b> 삼재는 띠로 보는 별도 민간 전통이고, 실제 사주에서는 대운·세운·원국의 관계를 함께 봅니다. 삼재 기간이라도 다른 흐름이 좋을 수 있고, 삼재가 아니어도 현실적으로 조심해야 할 일은 생길 수 있습니다.</p></div>
      </div>

      <div class="profile-panel" id="pt-match">
        ${상담궁합(e,c,need,comp,dm)}
        <h3 class="friendly-title">내가 편한 관계의 특징</h3><div class="reader-session"><p>${dm.traits?.[0]||''}</p><p>${dm.traits?.[1]||''}</p><p>그래서 상대에게는 내 방식과 똑같기를 요구하기보다, 내가 부족하게 쓰는 ${need} 기운을 편하게 보여주는 사람이 보완이 될 수 있습니다.</p></div>
        <h3 class="friendly-title">띠와 생월은 참고만</h3><div class="compat-grid"><div><span>오행 보완 생월</span><strong>${comp?comp.months.map(x=>x+'월').join(' · '):'—'}</strong><small>대표 ${comp?.best||'—'}월생</small></div><div><span>오행 보완 띠</span><strong>${comp?comp.zodiacs.join(' · '):'—'}</strong><small>대표 ${comp?.bestZodiac||'—'}</small></div></div>
        <div class="reader-session"><p><b>결혼·연애 궁합은 생년월일시 전체를 넣어야 합니다.</b> 띠가 맞아도 일주와 월주가 부딪힐 수 있고, 띠가 다소 충이어도 다른 기둥에서 잘 맞을 수 있습니다. ‘우리 둘’ 메뉴에서 두 사람을 같이 보는 것이 더 낫습니다.</p></div>
      </div>

      <div class="profile-panel" id="pt-expert">
        <div class="expert-warning"><b>전문 만세력</b><span>여기부터는 실제 명리 용어를 확인하는 영역입니다. 위의 사주풀이와 앞날운세가 이해되면 필요할 때만 펼쳐보세요.</span></div>
        <details class="expert" open><summary>원국 · 지장간 · 십신</summary>${hiddenStemHtml(e,p)}${advancedPillarTable(e,p)}</details>
        <details class="expert"><summary>합 · 충 · 형 · 파 · 해</summary><div class="stack">${rels.length?rels.map(x=>`<div>${x}</div>`).join(''):'<div>두드러진 자동 감지 조합이 없습니다.</div>'}</div><p class="small muted">합은 무조건 좋고 충은 무조건 나쁜 것이 아닙니다. 어떤 기둥에서 어떻게 작동하는지를 함께 봅니다.</p></details>
        <details class="expert"><summary>주요 신살</summary>${easyShensalHtml(shens)}</details>
        <details class="expert"><summary>납음 · 십이운성 · 공망</summary>${advancedPillarTable(e,p)}</details>
        <details class="expert"><summary>격국 · 용신 참고</summary><div class="plain-note"><b>자동 확정하지 않습니다.</b> 단순 균형 계산에서는 ${strength.candidate.join('·')} 기운을 먼저 살펴볼 후보로 둡니다. 실제 격국·용신 판단은 월령·통근·투간·조후·통관 등 유파별 판단을 종합해야 합니다.</div></details>
        <details class="expert"><summary>계산 정보와 정확도</summary><p class="small"><b>양력 환산</b> ${s.toYmd()} ${s.getHour?.()??''}:${pad(s.getMinute?.()??0)}<br><b>야자시</b> ${p.sect==='1'?'23시를 다음날':'23시를 당일'} 기준<br><b>출생지 진태양시</b> 미보정<br><b>출생시간 모름</b> ${p.timeKnown==='unknown'?'시주 해석 제외':'시주 포함'}</p></details>
      </div>
      <div class="notice-inline"><b>중요</b><span>이 앱의 미래 해석은 전통 명리 규칙을 생활 언어로 풀어낸 참고입니다. 실제 사건이나 성공을 확정적으로 예언하지 않습니다.</span></div>`;
  }catch(err){$('#profileResult').hidden=false;$('#profileResult').innerHTML=`<p class="pillwarn">${err.message}</p>`}
}

// ===== 오늘결 6.2 · 실제 역술 상담처럼 부드럽고 구체적으로 풀어주는 모드 =====
const CAREER_DETAIL={
  甲:{jobs:['조직 리더','프로젝트 매니저(PM)','공공행정','교육기획','건축·토목 관리','인사·조직개발','전략기획','창업·사업운영'],why:'방향을 세우고 사람과 일을 오래 끌고 가는 힘을 쓰는 자리',env:'권한과 책임이 분명하고, 단기 실적보다 긴 호흡으로 결과를 만드는 환경',avoid:'매일 지시가 바뀌거나 권한 없이 책임만 지는 자리'},
  乙:{jobs:['서비스기획','UX기획','HR','상담·코칭','고객경험(CX)','마케팅기획','MD','교육·복지 실무'],why:'사람 사이의 온도와 관계를 읽고 부드럽게 연결하는 자리',env:'협업이 많고, 상대의 요구를 조율해 실제 결과로 바꾸는 환경',avoid:'성과를 오직 경쟁과 압박으로만 밀어붙이는 환경'},
  丙:{jobs:['영업','홍보·PR','콘텐츠 제작','강사·교육','방송·미디어','브랜드마케팅','행사기획','조직 내 대외협력'],why:'내가 가진 에너지를 밖으로 보여주고 사람을 움직이는 자리',env:'반응이 빠르고 사람을 직접 만나며 성과가 눈에 보이는 환경',avoid:'오랫동안 혼자 반복 작업만 하고 표현할 기회가 거의 없는 환경'},
  丁:{jobs:['교사·강사','상담사','에디터','연구기획','브랜드기획','디자인기획','품질기획','의료·돌봄 전문직'],why:'작은 차이를 오래 들여다보고 상대가 놓친 부분을 챙기는 자리',env:'집중할 시간이 보장되고 완성도와 섬세함을 인정받는 환경',avoid:'속도만 재촉하면서 품질이나 사람의 사정을 거의 보지 않는 환경'},
  戊:{jobs:['운영관리','시설·안전관리','부동산·자산관리','공공기관 행정','생산관리','조직관리','사업관리','재무운영'],why:'기준을 만들고 흔들리는 조직이나 일을 안정시키는 자리',env:'역할이 명확하고, 쌓아 올린 경험이 자산이 되는 환경',avoid:'근거 없이 방향이 자주 바뀌고 책임 소재가 불분명한 환경'},
  己:{jobs:['품질관리','간호·돌봄','교육행정','총무','재무실무','물류·운영','식품·생활서비스','고객관리'],why:'남들이 지나치는 작은 문제를 미리 발견하고 생활 수준으로 정리하는 자리',env:'세부를 챙길수록 성과가 좋아지고 신뢰가 쌓이는 환경',avoid:'업무 범위가 끝없이 넓어져 모든 잡무를 혼자 떠안는 환경'},
  庚:{jobs:['엔지니어','보안·감사','법무·컴플라이언스','경찰·소방·군','품질보증(QA)','생산기술','데이터 거버넌스','위기관리'],why:'문제가 생겼을 때 기준을 세우고 빠르게 잘라내거나 해결하는 자리',env:'규칙과 책임이 명확하고 판단력·전문성을 인정받는 환경',avoid:'기준 없이 눈치만 보거나 비효율을 알면서도 고칠 권한이 없는 자리'},
  辛:{jobs:['정밀기술','회계·세무','감사','디자인','의료기술','연구분석','품질검사','데이터분석','편집·교정'],why:'완성도를 높이고 오류를 찾아내며 미세한 차이를 구분하는 자리',env:'정확성과 전문성이 성과로 이어지는 환경',avoid:'대충 빨리 끝내는 것을 능력으로 보는 환경'},
  壬:{jobs:['전략기획','신사업','무역·해외영업','물류·교통','미디어','플랫폼사업','투자·시장리서치','데이터기획','여행·항공'],why:'정보·사람·지역·기회를 넓게 연결하고 흐름을 읽는 자리',env:'변화가 있고 여러 분야를 넘나들며 새로운 선택지를 만드는 환경',avoid:'변화가 거의 없고 같은 절차만 반복하며 이동 여지가 없는 환경'},
  癸:{jobs:['데이터분석','연구원','상담사','심리·코칭','기획자','에디터','UX리서처','의료·보건','재무분석','정보관리'],why:'겉으로 드러나지 않은 흐름과 사람의 반응을 세밀하게 읽는 자리',env:'관찰하고 분석한 뒤 정확하게 판단할 시간이 있는 환경',avoid:'충분한 정보 없이 즉석 결정을 계속 요구하거나 감정적으로 경쟁시키는 환경'}
};
const ELEMENT_LIFE_EXAMPLE={
  목:'새 자격증 공부를 시작하거나, 새 프로젝트의 첫 틀을 잡거나, 새로운 사람을 만나 네트워크를 넓히는 행동',
  화:'발표·면접·고백·홍보처럼 나를 밖으로 보여주고 반응을 확인하는 행동',
  토:'저축계획을 다시 세우고 집·직장·생활 루틴을 안정시키거나 미뤄둔 실무를 정리하는 행동',
  금:'계약서를 다시 읽고 기준을 세우며 불필요한 지출·관계·업무를 정리하는 행동',
  수:'자료를 모으고 공부하며 여행·이동·새 정보 탐색처럼 선택지를 넓히는 행동'
};
function 상담성향(ec,c,dm){
  const entries=Object.entries(c).sort((a,b)=>b[1]-a[1]), high=entries[0][0], low=[...entries].reverse()[0][0];
  const h=ELEMENT_TONE[high],l=ELEMENT_TONE[low], traits=(dm.traits||[]).filter(Boolean);
  return `<div class="fortune-reader talk-reader"><div class="reader-mark">사주 선생님이 설명하듯 풀어볼게요</div>
  <p>먼저 중심부터 볼게요. <b>${dm.name||''} 일간</b>은 ${dm.summary||'자기만의 방식으로 상황을 읽는 기운'}으로 봅니다. ${traits[0]?traits[0]+'.':''} ${traits[1]?traits[1]+'.':''}</p>
  <p>그런데 사람은 일간 하나로만 설명되지 않아요. 전체 여덟 글자를 같이 보면 <b>${high} 기운이 가장 두드러지고 ${low} 기운은 상대적으로 적게</b> 보입니다. 그래서 평소에는 ${h.good}이 자연스럽게 나오고, 반대로 ${l.good}은 의식해서 써야 균형이 맞습니다.</p>
  <p><b>생활에서 어떻게 보이느냐면요.</b> 예를 들어 ${high} 기운이 강할 때는 ${ELEMENT_LIFE_EXAMPLE[high]}처럼 ‘내가 원래 잘하는 방식’으로 움직이기 쉽습니다. 반대로 ${low} 기운이 필요한 때에는 ${ELEMENT_LIFE_EXAMPLE[low]}을 일부러 선택해보는 게 좋습니다.</p>
  <p>여기서 중요한 건 “${low}이 부족하니 나쁘다”가 아닙니다. 오히려 내가 평소 잘 안 쓰는 방식이 무엇인지 알면 선택이 쉬워집니다. 일이 막힐 때 계속 같은 방식으로 밀어붙이는 대신, 부족한 기운의 방식을 한 번 써보는 거죠.</p>
  <div class="reader-em"><b>한마디로 정리하면</b><br>타고난 장점은 ${h.good}이고, 성장 포인트는 ${l.good}입니다. 이 두 가지를 같이 쓰면 사주의 균형이 훨씬 부드러워집니다.</div></div>`;
}
function 분야상담(ec,c){
  const dg=ec.getDayGan(), d=CAREER_DETAIL[dg]||CAREER_DETAIL['癸'];
  const sorted=Object.entries(c).sort((a,b)=>b[1]-a[1]), high=sorted[0][0], low=[...sorted].reverse()[0][0];
  const career=`<div class="deep-topic"><span>직업 · 일</span><h4>구체적으로 어떤 일이 잘 맞을까요?</h4><p>직업명 하나를 딱 찍기보다, <b>${d.why}</b>에서 강점이 잘 살아나는 편으로 봅니다.</p><div class="job-tags">${d.jobs.map(x=>`<b>${x}</b>`).join('')}</div><p><b>잘 맞는 환경</b>은 ${d.env}입니다. 반대로 ${d.avoid}에서는 능력과 별개로 피로가 빨리 쌓일 수 있어요.</p><p><b>실제 직장 장면으로 예를 들면</b>, 회의에서 남들이 놓친 문제를 구조화해주거나, 일이 꼬였을 때 “먼저 이것부터 정리하자”고 순서를 잡아주는 역할을 맡을 때 평판이 좋아질 가능성이 큽니다. 이직할 때도 회사 이름보다 <b>내가 실제로 어떤 권한과 역할을 갖는지</b>를 꼭 보세요.</p></div>`;
  const money=`<div class="deep-topic"><span>돈 · 재물</span><h4>돈복보다 먼저 돈을 다루는 방식을 볼게요</h4><p>${high} 기운이 강한 사람은 돈에서도 그 성향이 반복되기 쉽습니다. ${high==='토'?'안정성과 보유를 중시해 현금·저축·부동산처럼 눈에 보이는 기반을 좋아할 수 있습니다.':high==='수'?'기회와 정보를 많이 보게 되어 여러 선택지를 동시에 만지기 쉽습니다.':high==='화'?'기분과 활동량이 커질 때 지출도 함께 커지기 쉽습니다.':high==='금'?'기준과 효율을 따져 불필요한 소비를 줄이는 데 강점이 있습니다.':'미래 가능성에 돈을 쓰는 편이라 공부·자기계발·새로운 시도에 지출이 생기기 쉽습니다.'}</p><p><b>예를 들어</b> 월급이 들어왔을 때 먼저 쓸 돈부터 생각하기보다 ‘생활비·비상금·장기목표’ 세 통으로 나눠두는 식이 잘 맞습니다. 큰 계약이나 투자는 운세보다 <b>손실을 감당할 수 있는 범위와 현금흐름</b>을 먼저 확인해야 합니다.</p><p>${low} 기운을 보완한다는 뜻은 돈에서도 적용됩니다. ${ELEMENT_LIFE_EXAMPLE[low]} 같은 태도를 돈 관리에 가져오면 한쪽으로 치우치는 걸 막는 데 도움이 됩니다.</p></div>`;
  const love=`<div class="deep-topic"><span>연애 · 부부</span><h4>좋아하는 사람 앞에서는 어떤 모습이 나올까요?</h4><p>${dg==='壬'||dg==='癸'?'마음은 깊은데 겉으로는 바로 다 보여주지 않는 편이라 상대가 “무슨 생각인지 모르겠다”고 느낄 수 있습니다.':dg==='丙'||dg==='丁'?'좋아하면 표현이 분명해지는 편이지만 감정이 올라온 순간에는 말이 빨라질 수 있습니다.':dg==='庚'||dg==='辛'?'신뢰와 예의를 중요하게 보고 한 번 마음이 멀어지면 다시 가까워지는 데 시간이 걸릴 수 있습니다.':'관계가 안정적으로 이어지는 것을 중요하게 보고 약속과 생활 호흡을 꽤 중요하게 보는 편입니다.'}</p><p><b>실제 갈등 장면으로 보면</b>, 답장이 늦거나 상대 반응이 애매할 때 혼자 결론부터 내리는 것보다 “요즘 바쁜 거야?”처럼 사실을 먼저 확인하는 편이 좋습니다. 반대로 내가 불편한데도 계속 맞춰주다가 한꺼번에 터뜨리는 방식은 관계를 더 어렵게 만들 수 있어요.</p><p><b>잘 맞는 사람</b>은 내 속도를 존중하면서도 ${low} 기운의 장점, 즉 ${ELEMENT_TONE[low].good}을 자연스럽게 보여주는 사람입니다. 단순히 띠가 맞는 사람보다 실제로 대화를 편하게 이어갈 수 있는지가 더 중요합니다.</p></div>`;
  const family=`<div class="deep-topic"><span>가족 · 인간관계</span><h4>가까운 사람에게는 어떤 역할을 맡기 쉬울까요?</h4><p>${high==='토'?'가족 안에서 버팀목이나 해결사 역할을 맡기 쉽습니다.':high==='수'?'분위기를 먼저 읽고 갈등이 커지기 전에 조용히 조정하는 역할을 하기 쉽습니다.':high==='화'?'분위기를 살리고 사람을 움직이는 역할을 하기 쉽습니다.':high==='금'?'기준을 세우고 잘못된 부분을 바로잡는 역할을 맡기 쉽습니다.':'사람을 챙기고 새로운 방향을 제안하는 역할을 하기 쉽습니다.'}</p><p><b>예를 들어</b> 가족 문제나 직장 갈등이 생겼을 때 “내가 알아서 할게”라고 모두 떠안기보다, 누가 무엇을 맡을지 분명히 나누는 것이 좋습니다. 가까운 관계일수록 책임과 애정을 혼동하지 않는 게 중요합니다.</p></div>`;
  return `<div class="deep-consult-grid">${career}${money}${love}${family}</div>`;
}
function yearCounselText(ec,p,y){
  const d=yearLuckData(ec,y), el=ELS[d.g], age=ageKoreanSimple(p,y), et=ELEMENT_TONE[el];
  let scene,work,money,relationText,health,action;
  if(d.it.type==='합'){
    scene='사람이나 일이 자연스럽게 이어지는 장면이 많아질 수 있습니다. 예전에 끊겼던 연락이 다시 오거나, 혼자 하던 일에 협력자가 붙거나, 소개를 통해 새로운 기회를 만나는 식입니다.';
    relationText='특히 관계운은 “새 사람을 많이 만나라”보다 이미 아는 사람과의 연결을 살리는 쪽이 더 자연스럽습니다. 미뤄둔 연락, 화해, 협의, 소개 자리가 실제 기회로 이어질 수 있습니다.';
  }else if(d.it.type==='충'){
    scene='기존 계획이 그대로 가지 않고 수정되는 일이 생기기 쉽습니다. 예를 들면 부서 이동, 담당 변경, 이사 고민, 관계의 거리 조정처럼 “원래 계획과 다른 선택”을 요구받을 수 있습니다.';
    relationText='사람 문제도 흑백으로 자르기보다 시간을 두고 보는 게 좋습니다. 서운한 일이 생겨도 바로 관계를 끝내기보다 하루 이틀 지나 사실을 확인한 뒤 말하는 편이 유리합니다.';
  }else{
    scene='눈에 띄는 큰 사건보다 내가 평소 쌓아온 습관과 준비가 결과를 만드는 해입니다. 갑자기 운이 바뀐다기보다, 잘해온 사람은 성과가 모이고 미뤄온 것은 정리해야 할 시점이 오는 식입니다.';
    relationText='관계는 특별한 이벤트보다 기본이 중요합니다. 약속을 지키고, 먼저 안부를 묻고, 애매한 것은 묻는 사람이 결국 편한 관계를 만들게 됩니다.';
  }
  const relMap={
    지원:'혼자 끌고 가기보다 사람·정보·제도의 도움을 잘 받는 게 중요합니다. 예를 들어 선배에게 조언을 구하거나, 교육·자격증·상담처럼 외부 자원을 쓰면 시간을 크게 줄일 수 있습니다.',
    표현:'준비한 것을 밖으로 보여줘야 반응이 오는 해입니다. 보고서만 쌓아두기보다 발표하고, 이력서만 고치기보다 지원하고, 아이디어만 생각하지 말고 실제 시안을 보여주는 쪽이 좋습니다.',
    동질:'내 방식대로 밀고 갈 힘은 생기지만 경쟁도 같이 커질 수 있습니다. 같은 직급 동료와 성과를 비교하거나 비슷한 사람끼리 주도권을 놓고 부딪히는 장면은 조심하세요.',
    관리:'돈·실적·계약·책임처럼 “결과를 숫자로 확인하는 일”이 중요해집니다. 계좌, 문서, 일정, 계약조건을 정리하면 생각보다 큰 효과가 납니다.',
    압박:'해야 할 일과 책임이 늘어나 체력과 마음이 먼저 지칠 수 있습니다. 일이 몰릴수록 “다 해내야 한다”보다 꼭 해야 할 일과 미뤄도 되는 일을 나누는 것이 중요합니다.',
    중립:'운보다 현실 조건의 비중이 큰 해입니다. 환경을 탓하거나 운을 기다리기보다 준비 수준과 선택 기준이 결과를 더 크게 좌우합니다.'
  };
  work={지원:'직장에서는 도움을 받을 사람이 생기거나 배울 기회가 생길 수 있습니다. 새로운 시스템을 배우거나 멘토·상사의 지원을 받는 일, 필요한 부서와 협업하는 것이 좋습니다.',표현:'평가·승진·면접·발표처럼 “보여주는 장면”을 피하지 마세요. 예를 들어 맡은 일을 조용히 끝내기만 하기보다 결과와 효과를 숫자로 정리해 상사에게 보여주는 것이 좋습니다.',동질:'주도권이 생기는 만큼 동료와 경쟁도 커질 수 있습니다. 혼자 공을 가져가기보다 역할을 나눠야 뒤탈이 적습니다.',관리:'계약, 예산, 실적, 인력 배치처럼 실제 운영을 맡을 가능성이 큽니다. 숫자 하나, 문서 한 줄이 중요한 시기라 최종 확인 습관이 도움이 됩니다.',압박:'업무량이나 책임 증가가 먼저 체감될 수 있습니다. 승진이나 중요한 역할이 기회가 될 수 있지만, 권한 없이 책임만 늘어나는 자리라면 조건을 꼭 확인하세요.',중립:'새 프로젝트를 무리하게 늘리기보다 현재 맡은 일을 완성하고, 다음 단계에 필요한 기술이나 자격을 준비하는 쪽이 좋습니다.'}[d.rel];
  money=d.rel==='관리'?'돈과 관련해서는 정리력이 힘을 발휘합니다. 대출금리, 보험, 구독서비스, 고정비처럼 매달 빠지는 돈을 점검해보세요. 큰 계약은 “얼마를 벌까”보다 중도해지·손실 조건부터 보는 게 좋습니다.':d.rel==='표현'?'성과가 드러나면서 수입 기회가 생길 수 있지만 활동량이 커져 지출도 따라오기 쉽습니다. 보너스나 추가수입이 생겨도 바로 소비 수준을 올리기보다 일부를 남겨두는 편이 좋습니다.':d.rel==='압박'?'가족비용, 차량·집 수리, 업무상 지출처럼 예상하지 못한 책임성 비용이 생길 수 있습니다. 비상금을 너무 빡빡하게 투자하지 말고 현금 여유를 남겨두세요.':'재물은 한 번의 큰 행운보다 관리 습관이 좌우합니다. 할부·구독·소액 반복지출처럼 잘 안 보이는 돈부터 정리하면 체감이 큽니다.';
  health=d.rel==='압박'?'몸은 과로 신호를 무시하지 않는 게 중요합니다. 잠이 줄고 짜증이 늘거나 소화·긴장 같은 신호가 반복되면 일정을 줄이는 쪽이 먼저입니다. 의료 문제는 사주가 아니라 실제 검진과 전문가 판단을 우선하세요.':'컨디션은 일정과 수면의 영향을 크게 받을 수 있습니다. 좋은 운이라도 잠이 부족하면 판단이 거칠어지니 중요한 결정 전에는 생활 리듬을 먼저 챙기세요.';
  action=`${et?.use||'중요한 일'}을 실제 행동으로 옮겨보세요. 예를 들어 ${ELEMENT_LIFE_EXAMPLE[el]||'미뤄둔 일 하나를 구체적으로 시작하는 것'}이 이 해의 흐름과 잘 맞습니다. 다만 ${et?.risk||'무리한 확장'}이 나타날 때는 속도를 한 번 줄이는 것이 좋습니다.`;
  return {d,headline:`${y}년${age?` · ${age}세`:''} — ${d.grade.label}`,intro:scene,rel:relMap[d.rel]||relMap.중립,work,money,relationText,health,action};
}
function annualCounselHtml(ec,p,fromYear){
  const rows=[];for(let y=fromYear;y<fromYear+10;y++)rows.push(yearCounselText(ec,p,y));
  return `<div class="future-years detailed-years">${rows.map((x,i)=>`<article class="future-year ${i===0?'current':''}"><div class="fy-head"><span>${yearGanzhiKo(x.d.y)}년 · ${animalFromBranch(x.d.z)}</span><b>${x.headline}</b><em>${x.d.grade.label}</em></div>
  <p>${x.intro} ${x.rel}</p>
  <div class="scenario-box"><b>직장·일에서 실제로는</b><p>${x.work}</p></div>
  <div class="scenario-box"><b>돈에서는</b><p>${x.money}</p></div>
  <div class="scenario-box"><b>사람 관계에서는</b><p>${x.relationText}</p></div>
  <div class="scenario-box"><b>생활·컨디션</b><p>${x.health}</p></div>
  <div class="counsel-tip"><b>이 해를 이렇게 써보세요</b>${x.action}</div></article>`).join('')}</div>`;
}
function monthCounselDetail(ec,r){
  const base=relationPlain(r.rel); let overall,good,caution,example;
  if(r.inter.type==='합'){
    overall='사람과의 연결이 평소보다 부드럽게 느껴질 수 있는 달입니다. 혼자 막혀 있던 일이 대화 한 번, 소개 한 번으로 풀리는 식의 흐름을 기대해볼 수 있습니다.';
    good='먼저 연락하기, 미뤄둔 협의 다시 꺼내기, 소개받기, 팀원과 역할 다시 나누기처럼 사람을 통해 길을 여는 행동이 잘 맞습니다.';
    caution='분위기가 좋다고 계약·동업·연애 관계를 너무 빨리 확정하지는 마세요. 관계가 좋아 보이는 것과 조건이 좋은 것은 다른 문제입니다.';
    example='예를 들면 오래 연락 없던 거래처나 지인에게 안부를 보냈는데 새로운 제안이 이어지는 식입니다.';
  }else if(r.inter.type==='충'){
    overall='계획 변경이 생기거나 마음이 평소보다 쉽게 흔들릴 수 있는 달입니다. “왜 자꾸 계획대로 안 되지?”라는 느낌이 들 수 있지만, 오히려 오래된 문제를 바꾸라는 신호처럼 사용할 수 있습니다.';
    good='일정 재조정, 서류 재검토, 집이나 업무공간 정리, 오래된 계획 수정처럼 바꾸고 정리하는 일을 하세요.';
    caution='사표 제출, 큰 계약 해지, 관계 단절, 큰 지출처럼 되돌리기 어려운 선택은 감정이 가장 올라온 날 바로 결정하지 않는 것이 좋습니다.';
    example='예를 들어 부서 이동 이야기가 갑자기 나오면 무조건 거부하기보다 새 역할의 조건과 얻는 것을 먼저 비교해보는 식입니다.';
  }else{
    overall='큰 사건보다 기본기가 차이를 만드는 달입니다. 눈에 띄는 행운을 기다리기보다 평소 미뤄둔 것을 하나씩 정리하면 뒤로 갈수록 편해집니다.';
    good='밀린 업무 마감, 통장 정리, 운동 루틴 만들기, 공부 계획처럼 생활의 기본을 세우는 일이 좋습니다.';
    caution='심심하다고 갑자기 큰 변화를 만들 필요는 없습니다. 특히 계획에 없던 소비나 감정적인 결정은 한 번 더 생각하세요.';
    example='예를 들어 매달 새는 구독료를 정리하거나, 미뤄둔 건강검진을 예약하는 식의 작은 정리가 효과를 냅니다.';
  }
  if(r.rel==='표현'){good+=' 특히 발표·면접·보고·소개·홍보처럼 나를 밖으로 보여주는 일정은 뒤로 미루지 마세요.'; caution+=' 다만 자신감이 올라온 만큼 말이 세지거나 약속을 과하게 잡지 않도록 주의하세요.'}
  if(r.rel==='관리'){good+=' 계약서, 견적서, 보험, 세금, 예산처럼 숫자와 문서를 다루는 일도 처리하기 좋습니다.'; caution+=' 숫자 입력이나 날짜 착오처럼 사소한 실수는 마지막 확인으로 막으세요.'}
  if(r.rel==='압박'){good+=' 할 일을 줄이고 핵심 한두 개만 끝내는 방식이 오히려 성과가 납니다.'; caution+=' 수면을 줄여 버티거나 감정적으로 사람을 몰아붙이는 방식은 피하는 편이 좋습니다.'}
  return {overall:`${base}. ${overall}`,good,caution,example};
}
function monthCounselHtml(ec){
  const rows=monthlyLuckRows(ec);
  return `<div class="month-counsel detailed-months">${rows.map((r,i)=>{const t=monthCounselDetail(ec,r);return `<div class="mc-row ${i===0?'current':''}"><div><span>${r.y}년 ${r.m}월</span><b>${r.g.label}</b><small>${r.gz}월</small></div><p>${t.overall}</p><p><b>이달에 해볼 만한 것</b><br>${t.good}</p><p><b>특히 조심할 것</b><br>${t.caution}</p><div class="mini-example"><b>실제 상황 예시</b>${t.example}</div></div>`}).join('')}</div>`;
}
function currentCounselHtml(ec,p,nowYear){
  const ld=currentLuckData(ec,p,nowYear), y=yearCounselText(ec,p,nowYear), next=yearCounselText(ec,p,nowYear+1), sj=samjaeInfo(ec.getYearZhi(),nowYear);
  const first=ld.rows?.[0], cur=ld.cur, nxt=ld.next, dgan=cur?.gz?.[0], el=dgan?ELS[dgan]:null;
  const sam=sj?.current?`지금은 ${sj.current.stage}에 들어와 있습니다. 이번 삼재 주기는 ${sj.cycle.map(x=>`${x.year}년 ${x.stage}`).join(' → ')} 순서입니다. 다만 이 말만 듣고 겁먹을 필요는 없어요. 삼재는 띠를 기준으로 보는 민간 전통이라, 실제 판단은 그 해의 대운·세운과 현실 조건을 같이 봐야 합니다.`:`현재는 삼재 기간이 아닙니다. 다음 주기는 ${sj?.future?.map(x=>`${x.year}년 ${x.stage}`).join(' → ')||'계산 중'} 순서로 들어옵니다. 삼재가 시작된다고 모든 일이 나빠지는 것은 아니고, 그 시기에 변화·지출·관계 문제를 조금 더 꼼꼼히 보자는 정도로 이해하는 게 좋습니다.`;
  return `<div class="reader-session long-read conversation-flow"><h3>앞으로의 흐름은 이렇게 보면 가장 쉬워요</h3>
  <p>먼저 <b>대운</b>부터 볼게요. 대운은 하루나 한 달 운이 아니라 인생의 큰 계절에 가깝습니다. ${first?`당신은 <b>${first.sy}년, 약 ${first.sa}세부터 첫 대운</b>이 시작됐습니다.`:'출생정보를 기준으로 첫 대운 시작점을 계산합니다.'}</p>
  <p>${cur?`지금은 <b>${cur.sy}년부터 ${cur.ey}년까지 ${ganzhiKo(cur.gz)} 대운</b>에 있습니다. 나이로는 약 ${cur.sa}세부터 ${cur.ea}세 구간입니다.`:'현재 대운을 계산하고 있습니다.'} ${el?`이 10년은 ${el} 기운의 성격이 들어오므로 ${ELEMENT_TONE[el].good}을 잘 쓰는 것이 중요합니다. 실제로는 ${ELEMENT_LIFE_EXAMPLE[el]} 같은 선택이 이 시기의 흐름과 잘 맞습니다.`:''}</p>
  <p>${nxt?`그리고 <b>${nxt.sy}년경부터는 ${ganzhiKo(nxt.gz)} 대운</b>으로 넘어갑니다. 대운이 바뀌는 전후 1~2년은 직장·생활환경·사람관계처럼 “오래 이어지던 틀”이 달라지는 느낌을 받을 수 있어요. 그래서 그 무렵에는 단순히 좋다 나쁘다보다, 내가 무엇을 계속 가져가고 무엇을 바꿀지 정하는 것이 중요합니다.`:'다음 대운 전환점도 함께 계산합니다.'}</p>
  <div class="reader-em"><b>${nowYear}년은 이렇게 보세요</b><br>${y.intro} ${y.rel}<br><br><b>직장에서는</b> ${y.work}<br><br><b>돈에서는</b> ${y.money}<br><br><b>사람 관계에서는</b> ${y.relationText}</div>
  <p><b>${nowYear+1}년을 미리 보면</b>, ${next.intro} ${next.rel} 지금 당장 내년 일을 확정할 필요는 없지만, 올해 준비한 일이 내년에는 어떤 방식으로 이어질지 생각해두면 좋습니다.</p>
  <p><b>삼재도 같이 볼게요.</b> ${sam}</p></div>`;
}
function timingAdviceHtml(ec,p,nowYear){
  const years=[];for(let y=nowYear;y<nowYear+12;y++)years.push(yearCounselText(ec,p,y));
  const good=[...years].sort((a,b)=>b.d.score-a.d.score).slice(0,3),care=[...years].sort((a,b)=>a.d.score-b.d.score).slice(0,3);
  return `<div class="timing-pair conversational-timing"><div><span>앞으로 특히 활용해볼 해</span>${good.map((x,i)=>`<article class="timing-detail"><b>${i+1}순위 · ${x.d.y}년 · ${x.d.grade.label}</b><p>${x.intro}</p><p>${x.rel}</p><div class="mini-example"><b>이때 해볼 만한 것</b>${x.action}</div></article>`).join('')}</div><div><span>조금 천천히 판단할 해</span>${care.map(x=>`<article class="timing-detail"><b>${x.d.y}년 · ${x.d.grade.label}</b><p>${x.intro}</p><p>${x.d.it.type==='충'?'변화가 들어오는 해라 이직·이사·계약·관계정리 같은 큰 선택이 생길 수 있습니다. 나쁜 해라기보다 결정을 서두르지 말라는 쪽에 가깝습니다.':'일정·돈·체력의 균형을 먼저 챙기는 것이 중요한 해입니다.'}</p><div class="mini-example"><b>예를 들어</b>${x.d.it.type==='충'?'회사에서 이동 제안이 오면 당일 답하지 말고 역할·급여·출퇴근·성장 가능성을 표로 비교해보세요.':'새 일을 벌이기 전에 현재 진행 중인 일과 현금 여유부터 확인하세요.'}</div></article>`).join('')}</div></div>`;
}

// ===== 오늘결 7.0 · 중복제거형 대화해설 + 선택형 로컬 LLM =====
const V7_REL_THEMES={
  지원:{title:'배움과 도움을 받아들이는 해',verbs:['배우기','도움 요청하기','자격·교육 활용하기'],career:['새 업무를 배우거나 교육·연수를 받는 일','경험 많은 사람에게 피드백을 구하는 일','협업 부서의 지원을 받아 막힌 일을 푸는 일'],money:['지원금·교육비·복지제도처럼 받을 수 있는 혜택을 확인하는 일','충동투자보다 정보와 공부에 비용을 쓰는 일'],love:['상대의 말을 먼저 듣고 오해를 풀어가는 대화','혼자 결론내리기보다 상대의 사정을 확인하는 태도']},
  표현:{title:'보여주고 움직여 결과를 만드는 해',verbs:['발표하기','지원하기','제안하기'],career:['성과를 숫자와 사례로 정리해 상사에게 보여주는 일','이력서·포트폴리오를 실제 지원으로 연결하는 일','아이디어를 말로만 두지 않고 시제품이나 제안서로 꺼내는 일'],money:['성과급·부수입이 생겨도 생활수준을 바로 높이지 않는 일','홍보·영업 활동비처럼 활동성 지출을 예산 안에서 관리하는 일'],love:['호감이 있다면 애매한 신호보다 분명한 표현을 하는 일','감정이 올라온 순간에 과한 약속을 잡지 않는 일']},
  동질:{title:'내 페이스와 경쟁심이 함께 강해지는 해',verbs:['주도하기','역할 나누기','경쟁 기준 세우기'],career:['비슷한 실력의 동료와 경쟁하면서도 역할을 분명히 나누는 일','내 방식이 맞더라도 팀 규칙을 한 번 더 확인하는 일'],money:['친구·동료의 소비나 투자 흐름을 따라가지 않고 내 기준을 지키는 일','공동비용과 개인비용을 섞지 않는 일'],love:['상대와 누가 맞는지 따지기보다 각자 원하는 것을 말로 확인하는 일','자존심 때문에 먼저 연락할 타이밍을 놓치지 않는 일']},
  관리:{title:'돈·성과·계약을 현실적으로 정리하는 해',verbs:['정리하기','계약 확인하기','숫자로 점검하기'],career:['예산·일정·실적·인력처럼 결과가 숫자로 남는 일을 맡는 것','계약서나 보고서의 마지막 한 줄까지 확인하는 것'],money:['대출금리·보험·구독·고정비를 한 번에 점검하는 것','큰 지출은 총액보다 중도해지·유지비까지 계산하는 것'],love:['공동지출·여행비·생활분담처럼 현실적인 약속을 구체화하는 것','말보다 실제 약속 이행을 보는 것']},
  압박:{title:'책임이 커져 선택과 체력관리가 중요한 해',verbs:['우선순위 줄이기','도움 나누기','휴식 확보하기'],career:['승진·중요 업무 제안을 받을 때 권한과 책임을 같이 확인하는 것','일이 몰릴 때 꼭 해야 할 일과 미뤄도 되는 일을 분리하는 것'],money:['차량·주거·가족비용 같은 예기치 않은 지출에 대비해 현금 여유를 두는 것','무리한 대출이나 레버리지를 피하는 것'],love:['피곤한 상태에서 관계 결론을 내리지 않는 것','상대 요구를 다 들어주기보다 가능한 범위를 분명히 말하는 것']},
  중립:{title:'운보다 준비와 습관이 결과를 만드는 해',verbs:['마무리하기','기준 세우기','기초 다지기'],career:['현재 맡은 일을 완성도 있게 끝내고 다음에 필요한 기술을 준비하는 것','성과를 기록해 다음 평가나 이직 때 쓸 자료로 만드는 것'],money:['반복지출과 생활비를 정리해 새는 돈을 막는 것','큰 승부보다 비상금과 장기저축을 유지하는 것'],love:['특별한 이벤트보다 약속·안부·시간 약속을 지키는 것','애매한 감정은 추측보다 질문으로 확인하는 것']}
};
const V7_BRANCH_SCENE={
  子:['정보가 빠르게 오가고 이동이 잦아질 수 있습니다.','생활 리듬이 늦어지거나 생각이 많아질 수 있습니다.'],
  丑:['그동안 미뤄둔 현실 문제를 정리해야 할 장면이 생길 수 있습니다.','천천히 쌓은 것이 눈에 보이는 결과로 연결되기 쉽습니다.'],
  寅:['새로운 역할·공부·이동처럼 시작 신호가 들어오기 쉽습니다.','익숙한 방식보다 새로운 선택지를 시험하게 될 수 있습니다.'],
  卯:['사람 사이의 말과 관계가 중요한 변수가 되기 쉽습니다.','협의·소개·소통을 통해 길이 열리는 장면이 생길 수 있습니다.'],
  辰:['계획을 다시 구조화하고 기반을 다지는 일이 중요해집니다.','집·직장·돈처럼 생활 기반을 손보는 일이 생길 수 있습니다.'],
  巳:['표현·실행·경쟁이 빨라져 존재감을 드러낼 일이 생길 수 있습니다.','결정을 미루기보다 행동으로 옮겨야 결과가 보이기 쉽습니다.'],
  午:['사람 앞에 서거나 평가받는 장면이 늘 수 있습니다.','열정이 커지는 만큼 일정과 감정도 과열되기 쉽습니다.'],
  未:['가족·생활·재정처럼 현실적인 책임을 정리할 일이 생길 수 있습니다.','관계를 유지하는 방식과 생활 리듬을 다시 맞추게 될 수 있습니다.'],
  申:['업무 방식이나 인간관계에 변화를 요구하는 일이 생길 수 있습니다.','기술·정보·이동과 관련해 새 선택지가 들어올 수 있습니다.'],
  酉:['평가·정리·선택이 선명해지는 해라 불필요한 것을 덜어내기 좋습니다.','완성도와 기준을 높이는 일이 중요해질 수 있습니다.'],
  戌:['책임과 결과를 마무리하는 장면이 늘 수 있습니다.','오래 끌던 문제를 결론내거나 기준을 다시 세우게 될 수 있습니다.'],
  亥:['새 정보·사람·지역과 연결되며 시야가 넓어질 수 있습니다.','혼자 생각하던 일을 밖의 정보와 비교해보게 될 수 있습니다.']
};
const V7_STEM_TONE={
  甲:'방향을 세우고 오래 밀어가는 힘',乙:'조율하고 연결하며 빈틈을 메우는 힘',丙:'밖으로 드러내고 분위기를 움직이는 힘',丁:'섬세하게 집중하고 필요한 곳을 비추는 힘',戊:'기반을 만들고 버티며 책임지는 힘',己:'생활과 실무를 세밀하게 관리하는 힘',庚:'문제를 잘라내고 빠르게 판단하는 힘',辛:'정확도와 완성도를 높이는 힘',壬:'정보와 기회를 넓게 연결하는 힘',癸:'미묘한 흐름을 읽고 세심하게 대응하는 힘'
};
function v7hash(v){let h=2166136261;for(const ch of String(v)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}
function v7pick(seed,arr){return arr[v7hash(seed)%arr.length]}
function v7uniqParts(parts){const seen=new Set();return parts.filter(x=>{const k=String(x).replace(/\s+/g,' ').trim();if(!k||seen.has(k))return false;seen.add(k);return true})}
function v7yearFacts(ec,p,y){
  const d=yearLuckData(ec,y), age=ageKoreanSimple(p,y), theme=V7_REL_THEMES[d.rel]||V7_REL_THEMES.중립;
  const branch=v7pick(`${ec.getDay()}-${y}-branch`,V7_BRANCH_SCENE[d.z]||['현실적인 선택이 중요해지는 해입니다.']);
  const stem=V7_STEM_TONE[d.g]||'내 방식으로 상황을 정리하는 힘';
  const inter=d.it.type==='합'?'특히 내 일지와 해의 지지가 합을 이루어 사람·협업·연결이 평소보다 자연스럽게 이어질 수 있습니다.':d.it.type==='충'?'내 일지와 해의 지지가 충을 이루어 직장·관계·생활패턴 가운데 하나는 기존 방식대로만 가기 어렵고 조정이 필요할 수 있습니다.':'내 일지와 해의 지지 사이에 큰 합·충은 없어, 이 해는 사건 자체보다 준비 수준과 선택 방식의 영향이 더 큽니다.';
  const yearRel=d.yr.type==='합'?'출생년 지지와도 합이 있어 가족·기존 인맥·오래된 환경에서 도움이나 연결이 생길 여지가 있습니다.':d.yr.type==='충'?'출생년 지지와 충이 있어 가족·기존 환경·오래된 관계에서 변화 요구가 생길 수 있으니 감정적인 결론보다 조율이 필요합니다.':'';
  return {d,age,theme,branch,stem,inter,yearRel};
}
function v7yearCounsel(ec,p,y){
  const f=v7yearFacts(ec,p,y), seed=`${ec.getDay()}-${y}-${f.d.rel}-${f.d.it.type}`;
  const openings=[
    `${y}년은 한마디로 <b>${f.theme.title}</b>에 가깝습니다.`,
    `${y}년의 중심을 먼저 잡으면 <b>${f.theme.title}</b>이라고 볼 수 있습니다.`,
    `이 해는 화려한 한마디보다 <b>${f.theme.title}</b>이라는 표현이 가장 잘 맞습니다.`
  ];
  const overall=v7uniqParts([v7pick(seed+'o',openings),f.branch,`천간 ${GAN_KO[f.d.g]}의 성격은 ${f.stem}을 더합니다.`,f.inter,f.yearRel]).join(' ');
  const careerExample=v7pick(seed+'c',f.theme.career);
  const moneyExample=v7pick(seed+'m',f.theme.money);
  const loveExample=v7pick(seed+'l',f.theme.love);
  const career=`직장에서는 ${careerExample}이 실제 포인트가 됩니다. ${f.d.it.type==='충'?'예컨대 부서 이동이나 담당 변경 제안이 오면 “변화가 싫다”만으로 거절하지 말고 역할·급여·근무시간·성장 가능성을 각각 적어 비교해보는 게 좋습니다.':f.d.it.type==='합'?'예컨대 혼자 막혀 있던 프로젝트라면 이전에 같이 일했던 동료나 다른 부서에 도움을 요청했을 때 예상보다 쉽게 연결될 수 있습니다.':'예컨대 연말평가를 앞두고 있다면 잘한 일을 기억에만 두지 말고 숫자·사진·성과 사례로 정리해두는 식이 도움이 됩니다.'}`;
  const money=`돈에서는 ${moneyExample}을 우선하세요. ${f.d.rel==='관리'?'예를 들어 카드·보험·대출·구독료를 한 화면에 적어 월 고정비를 계산하면 바로 줄일 항목이 보일 수 있습니다.':f.d.rel==='압박'?'예를 들어 차량수리나 가족비용처럼 갑작스러운 지출이 생겨도 버틸 수 있도록 생활비 몇 달치의 현금 여유를 너무 공격적으로 묶지 않는 편이 낫습니다.':f.d.rel==='표현'?'예를 들어 보너스나 부수입이 생겨도 그달 소비 수준을 바로 높이지 말고 일부를 다음 목표용 자금으로 떼어두는 식이 좋습니다.':'예를 들어 계획에 없던 큰 구매가 생기면 바로 결제하기보다 하루 뒤 다시 보면서 유지비와 기회비용까지 계산해보세요.'}`;
  const relation=`관계에서는 ${loveExample}이 중요합니다. ${f.d.it.type==='합'?'오래 연락이 끊긴 사람에게 먼저 안부를 보내거나, 미뤄둔 화해·협의를 다시 꺼내는 데 비교적 부드러운 흐름입니다. 다만 분위기가 좋다고 관계의 깊이나 약속을 너무 빨리 확정하지는 마세요.':f.d.it.type==='충'?'서운한 말을 들었을 때 바로 차단하거나 관계를 끝내기보다 하루 정도 지나 사실과 감정을 나눠 말하는 편이 후회를 줄입니다.':'특별한 사건보다 평소의 약속 이행과 말의 일관성이 관계의 질을 좌우합니다.'}`;
  const body=`${f.d.rel==='압박'?'체력과 수면을 일정에 포함시켜야 하는 해입니다. 일이 많아질수록 “시간이 남으면 쉰다”가 아니라 먼저 쉬는 시간을 확보하고 나머지를 배치하는 편이 낫습니다.':'생활 쪽에서는 수면·운동·식사처럼 기본 리듬을 일정하게 유지할수록 판단이 안정됩니다.'} 건강 문제 자체는 사주로 판단하지 말고 실제 증상이 있으면 검진과 의료진 판단을 우선하세요.`;
  const action=v7pick(seed+'a',[
    `${f.theme.verbs[0]}부터 시작해보세요. 이번 해에는 계획을 크게 잡기보다 한 가지를 실제 일정에 넣는 것이 중요합니다.`,
    `${f.theme.verbs[1]}를 의식적으로 해보는 해입니다. 혼자 해결하는 습관이 있다면 한 번은 사람이나 제도를 활용해보세요.`,
    `${f.theme.verbs[2]}를 구체적인 행동으로 옮겨보세요. “언젠가”가 아니라 날짜와 조건을 정해 실행하는 쪽이 맞습니다.`
  ]);
  return {...f,headline:`${y}년${f.age?` · ${f.age}세`:''} — ${f.d.grade.label}`,overall,career,money,relation,body,action};
}
function yearCounselText(ec,p,y){
  const x=v7yearCounsel(ec,p,y);
  return {d:x.d,headline:x.headline,intro:x.overall,rel:'',work:x.career,money:x.money,relationText:x.relation,health:x.body,action:x.action};
}
function annualCounselHtml(ec,p,fromYear){
  const rows=[];for(let y=fromYear;y<fromYear+10;y++)rows.push(v7yearCounsel(ec,p,y));
  return `<div class="future-years detailed-years v7-years">${rows.map((x,i)=>`<article class="future-year ${i===0?'current':''}"><div class="fy-head"><span>${yearGanzhiKo(x.d.y)}년 · ${animalFromBranch(x.d.z)}</span><b>${x.headline}</b><em>${x.d.grade.label}</em></div><p class="year-main">${x.overall}</p><div class="scenario-box"><b>일·직장에서는 이렇게 보세요</b><p>${x.career}</p></div><div class="scenario-box"><b>돈에서는 이런 장면을 조심하세요</b><p>${x.money}</p></div><div class="scenario-box"><b>사람 관계는 이렇게 풀면 편합니다</b><p>${x.relation}</p></div><div class="scenario-box"><b>생활 리듬</b><p>${x.body}</p></div><div class="counsel-tip"><b>${x.d.y}년의 한 가지 실천</b>${x.action}</div></article>`).join('')}</div>`;
}
function v7monthDetail(ec,r,idx){
  const seed=`${ec.getDay()}-${r.y}-${r.m}-${r.rel}-${r.inter.type}`;
  const open={합:['이번 달은 사람을 통해 막힌 일이 풀릴 가능성을 살펴볼 만합니다.','혼자 끌고 가던 일을 대화와 연결로 풀어보기에 괜찮은 달입니다.','연락·소개·협의처럼 사람 사이의 흐름이 평소보다 부드럽게 느껴질 수 있습니다.'],충:['이번 달은 계획을 그대로 지키는 것보다 상황에 맞게 고치는 능력이 중요합니다.','예정에 없던 변경이 생길 수 있어 일정과 감정을 여유 있게 잡는 편이 낫습니다.','이달은 “왜 바뀌지?”보다 “무엇을 다시 맞출까?”라고 생각하는 편이 유리합니다.'],평:['이번 달은 큰 사건보다 작은 관리가 체감 차이를 만듭니다.','화려한 변화보다 미뤄둔 기본을 정리할수록 뒤가 편해집니다.','운을 기다리기보다 일상에서 하나씩 정돈하는 사람이 유리한 달입니다.']}[r.inter.type]||[];
  const relTheme=V7_REL_THEMES[r.rel]||V7_REL_THEMES.중립;
  const good=v7pick(seed+'g',relTheme.career);
  const caution=r.inter.type==='충'?v7pick(seed+'x',['사표·계약해지·관계단절처럼 되돌리기 어려운 결정은 감정이 가장 올라온 날 바로 확정하지 마세요.','이동·이직 제안이 갑자기 와도 장단점을 적어보고 최소 하루는 두고 답하는 편이 좋습니다.','일정이 꼬였다고 한꺼번에 모든 계획을 바꾸지 말고 영향이 큰 것부터 하나씩 조정하세요.']):r.rel==='압박'?v7pick(seed+'x',['잠을 줄여 버티는 방식은 판단력을 떨어뜨릴 수 있으니 일정부터 줄이세요.','해야 할 일을 모두 같은 우선순위에 두지 말고 꼭 필요한 한두 가지를 먼저 끝내세요.','사람의 요구를 다 받아주다 지치지 않도록 가능한 범위를 분명히 말하세요.']):v7pick(seed+'x',['분위기가 좋다고 큰 약속을 바로 확정하지 말고 조건을 한 번 더 확인하세요.','계획에 없던 큰 지출은 그날 바로 결제하지 말고 하루 뒤 다시 보세요.','일이 잘 풀릴 때 오히려 약속을 너무 많이 잡지 않도록 여유를 남기세요.']);
  const example=r.inter.type==='합'?v7pick(seed+'e',['예를 들어 오래 연락 없던 거래처에 안부를 보냈다가 새 프로젝트 이야기가 이어질 수 있습니다.','예전에 어색했던 동료와 식사나 커피를 계기로 다시 편하게 이야기할 수 있습니다.','혼자 해결이 안 되던 일을 다른 부서에 한 번 물어봤는데 예상보다 빠르게 답을 얻는 식입니다.']):r.inter.type==='충'?v7pick(seed+'e',['예를 들어 부서 일정이 갑자기 바뀌면 원래 계획을 고집하기보다 핵심 업무만 남기고 다시 배치하는 식입니다.','예정에 없던 지출이 생기면 다른 소비를 줄여 현금흐름을 맞추는 식의 조정이 필요할 수 있습니다.','연락 문제로 서운해져도 바로 관계 결론을 내리지 않고 다음 날 차분히 확인하는 식입니다.']):v7pick(seed+'e',['예를 들어 미뤄둔 건강검진을 예약하거나 반복 구독료를 정리하는 작은 일이 생각보다 만족감을 줄 수 있습니다.','평가자료나 이력서를 미리 정리해두면 갑자기 기회가 왔을 때 바로 쓸 수 있습니다.','책상·통장·일정표 중 하나를 정리하는 것만으로도 머릿속 부담이 줄 수 있습니다.']);
  return {overall:`${v7pick(seed+'o',open)} ${relationPlain(r.rel)}이 함께 들어옵니다.`,good:`${good}.`,caution,example};
}
function monthCounselHtml(ec){
  const rows=monthlyLuckRows(ec);
  return `<div class="month-counsel detailed-months v7-months">${rows.map((r,i)=>{const t=v7monthDetail(ec,r,i);return `<div class="mc-row ${i===0?'current':''}"><div><span>${r.y}년 ${r.m}월</span><b>${r.g.label}</b><small>${r.gz}월</small></div><p>${t.overall}</p><p><b>이달에 해볼 일</b><br>${t.good}</p><p><b>이달에 특히 조심할 일</b><br>${t.caution}</p><div class="mini-example"><b>실제 상황으로 보면</b>${t.example}</div></div>`}).join('')}</div>`;
}
function currentCounselHtml(ec,p,nowYear){
  const ld=currentLuckData(ec,p,nowYear), cur=ld.cur,nxt=ld.next,first=ld.rows?.[0], y=v7yearCounsel(ec,p,nowYear), next=v7yearCounsel(ec,p,nowYear+1), sj=samjaeInfo(ec.getYearZhi(),nowYear);
  const curEl=cur?.gz?.[0]?ELS[cur.gz[0]]:null, nextEl=nxt?.gz?.[0]?ELS[nxt.gz[0]]:null;
  const firstText=first?`${first.sy}년, 약 ${first.sa}세에 첫 대운이 시작됐습니다. 대운은 약 10년 동안 인생의 배경처럼 이어지는 큰 흐름이라, 매년 운보다 “이 시기에는 어떤 주제가 반복되는가”를 볼 때 더 중요합니다.`:'첫 대운 시작점을 계산하고 있습니다.';
  const curText=cur?`현재는 <b>${cur.sy}년부터 ${cur.ey}년까지 ${ganzhiKo(cur.gz)} 대운</b>입니다. ${curEl?`${curEl} 기운이 중심에 들어와 ${ELEMENT_TONE[curEl].good}을 어떻게 쓰느냐가 이 10년의 핵심입니다. 예를 들어 ${ELEMENT_LIFE_EXAMPLE[curEl]}처럼 실제 행동으로 연결될 때 이 대운의 장점이 살아납니다.`:''}`:'현재 대운 구간을 계산하고 있습니다.';
  const nextText=nxt?`다음 큰 전환은 <b>${nxt.sy}년경 ${ganzhiKo(nxt.gz)} 대운</b>으로 넘어갈 때입니다. ${nextEl?`${nextEl} 기운이 새 배경으로 들어오므로 ${ELEMENT_TONE[nextEl].good}이 더 중요해집니다.`:''} 전환 전후 1~2년은 직장·거주·관계·관심사가 바뀌는 선택지가 들어올 수 있으니, 그때는 “무조건 바꾼다/지킨다”보다 무엇을 가져가고 무엇을 내려놓을지 정하는 것이 중요합니다.`:'다음 대운 전환점을 계산하고 있습니다.';
  const sam=sj?.current?`올해는 ${sj.current.stage}입니다. ${sj.cycle.map(x=>`${x.year}년 ${x.stage}`).join(' → ')} 순서로 지나갑니다. 다만 삼재는 띠만으로 보는 민간 전통이기 때문에 이것 하나로 올해를 나쁜 해라고 정하지 않습니다. 실제 해석에서는 지금 대운과 ${nowYear}년 세운을 함께 보는 편이 맞습니다.`:`현재는 삼재 기간이 아닙니다. 다음 삼재는 ${sj?.future?.map(x=>`${x.year}년 ${x.stage}`).join(' → ')||'계산 중'} 순서입니다. 삼재가 들어온다고 사건이 정해지는 것이 아니라, 변화·지출·관계 문제를 평소보다 한 번 더 확인하는 시기로 참고하면 됩니다.`;
  return `<div class="reader-session long-read conversation-flow v7-current"><h3>먼저 큰 흐름부터 이야기해볼게요</h3><p>${firstText}</p><p>${curText}</p><p>${nextText}</p><div class="reader-em"><b>${nowYear}년 올해는 이렇게 보입니다</b><br>${y.overall}<br><br><b>직장·일</b><br>${y.career}<br><br><b>돈</b><br>${y.money}<br><br><b>사람 관계</b><br>${y.relation}<br><br><b>생활 리듬</b><br>${y.body}</div><p><b>${nowYear+1}년은 올해와 같은 말로 보지 않습니다.</b> ${next.overall} 올해가 ${y.theme.title}이라면 내년은 ${next.theme.title} 쪽에 더 가깝습니다. 그래서 올해의 행동을 그대로 반복하기보다 내년에 필요한 방식으로 미리 준비하는 것이 좋습니다.</p><p><b>삼재도 함께 짚어볼게요.</b> ${sam}</p><div class="llm-card" id="localLlmCard"><b>선택형 로컬 AI 상담문 다듬기</b><p>지원되는 안드로이드/PC에서는 무료 로컬 언어모델을 기기에 내려받아 위 해석을 더 자연스러운 대화체로 한 번 더 정리할 수 있습니다. 최초 모델 다운로드는 용량과 시간이 많이 들 수 있습니다.</p><button class="secondary" id="localLlmBtn" type="button">로컬 AI로 다시 풀어보기</button><div id="localLlmStatus" class="small muted"></div><div id="localLlmResult" class="llm-result" hidden></div></div></div>`;
}
function timingAdviceHtml(ec,p,nowYear){
  const years=[];for(let y=nowYear;y<nowYear+12;y++)years.push(v7yearCounsel(ec,p,y));
  const good=[...years].sort((a,b)=>b.d.score-a.d.score).slice(0,3),care=[...years].sort((a,b)=>a.d.score-b.d.score).slice(0,3);
  return `<div class="timing-pair conversational-timing"><div><span>앞으로 특히 힘을 써볼 해</span>${good.map((x,i)=>`<article class="timing-detail"><b>${i+1}순위 · ${x.d.y}년 · ${x.d.grade.label}</b><p>${x.overall}</p><div class="mini-example"><b>구체적으로 해볼 것</b>${x.action}</div></article>`).join('')}</div><div><span>결정을 한 번 더 확인할 해</span>${care.map(x=>`<article class="timing-detail"><b>${x.d.y}년 · ${x.d.grade.label}</b><p>${x.overall}</p><div class="mini-example"><b>이때는 이렇게</b>${x.d.it.type==='충'?'이직·이사·계약·관계정리 제안이 오면 당일 결론보다 조건을 적어 비교하고 하루 이상 두고 답하세요.':'새 일을 늘리기 전에 현재 일정·현금여유·체력부터 확인하세요.'}</div></article>`).join('')}</div></div>`;
}
function 분야상담(ec,c){
  const dg=ec.getDayGan(),d=CAREER_DETAIL[dg]||CAREER_DETAIL.癸,sorted=Object.entries(c).sort((a,b)=>b[1]-a[1]),high=sorted[0][0],low=[...sorted].reverse()[0][0];
  const career=`<div class="deep-topic"><span>직업 · 일</span><h4>직업 이름보다 ‘어떤 역할’이 맞는지부터 볼게요</h4><p>${d.why}에서 강점이 살아납니다. 그래서 아래 직무들은 단순히 이름이 좋아서가 아니라, 실제 업무 방식이 당신의 기본 성향과 맞을 가능성이 높은 예입니다.</p><div class="job-tags">${d.jobs.map(x=>`<b>${x}</b>`).join('')}</div><p><b>구체적인 직장 장면을 들어보면</b> ${dg==='壬'?'신사업 회의에서 여러 부서 정보를 모아 “이 세 가지를 묶으면 새 서비스가 된다”고 연결하거나, 해외·시장 자료를 비교해 다음 선택지를 제안하는 역할':dg==='癸'?'데이터나 사람 반응을 오래 관찰해 “문제는 여기에서 시작된다”고 조용히 짚거나, 상담·리서치에서 상대가 말하지 않은 불편을 발견하는 역할':dg==='庚'?'사고나 장애가 생겼을 때 기준을 세우고 무엇부터 막아야 하는지 빠르게 정하거나, 품질·보안·안전 규칙을 실제 현장에 적용하는 역할':dg==='辛'?'보고서·데이터·제품에서 작은 오류를 찾아 완성도를 올리고, 회계·품질·분석 업무에서 기준을 정교하게 적용하는 역할':'회의나 현장에서 흩어진 문제를 정리해 우선순위를 만들고 사람들에게 역할을 나눠주는 역할'}에서 평판이 좋아질 수 있습니다.</p><p><b>이직할 때는</b> 회사 이름보다 실제 업무가 ${d.env}인지 확인하세요. ${d.avoid}라면 급여가 좋아도 오래 버티기 힘들 수 있습니다.</p><p><b>면접에서 써먹을 사례</b>도 준비해두면 좋습니다. “문제가 생겼을 때 내가 어떤 기준으로 정리했고, 누구와 협업했고, 결과가 어떻게 바뀌었는지”를 숫자와 사례로 말하면 당신의 강점이 훨씬 잘 보입니다.</p></div>`;
  const money=`<div class="deep-topic"><span>돈 · 재물</span><h4>재물운보다 돈을 다루는 습관부터 볼게요</h4><p>${high} 기운이 강한 편이라 ${ELEMENT_TONE[high].good}이 돈 관리에도 나타나기 쉽습니다. 반대로 ${low} 기운의 방식은 의식적으로 넣어주는 편이 균형에 도움이 됩니다.</p><p><b>실제 방법은 간단합니다.</b> 월급날 ‘생활비·비상금·장기목표’ 세 계좌로 먼저 나누고, 계획에 없던 큰 구매는 하루 뒤 다시 보는 규칙을 정해두세요. 투자·대출·보험은 사주보다 손실 가능성·금리·해지조건·현금흐름을 우선해서 판단해야 합니다.</p><p><b>예를 들어</b> 보너스 300만원이 들어왔다면 전부 소비하거나 투자하기보다 비상금 보충, 필요한 지출, 장기목표로 역할을 먼저 나누는 식이 당신에게 더 안정적입니다.</p></div>`;
  const love=`<div class="deep-topic"><span>연애 · 부부</span><h4>관계에서는 ‘상대 마음 추측’보다 확인이 중요합니다</h4><p>${dg==='壬'||dg==='癸'?'마음이 깊어도 바로 다 보여주지 않는 편이라 상대는 가끔 “무슨 생각인지 모르겠다”고 느낄 수 있습니다.':dg==='丙'||dg==='丁'?'좋아하면 표현이 분명한 장점이 있지만 감정이 올라온 순간에는 말과 약속이 빨라질 수 있습니다.':dg==='庚'||dg==='辛'?'신뢰·예의·일관성을 중요하게 보기 때문에 작은 무례가 오래 남을 수 있습니다.':'안정성과 생활 호흡을 중요하게 보는 편이라 관계의 예측 가능성이 큰 안도감을 줍니다.'}</p><p><b>실제 사례로 보면</b> 답장이 평소보다 늦었다고 바로 “마음이 식었나?”라고 결론내리지 말고 “오늘 바쁜가 봐, 괜찮아?”처럼 사실을 먼저 확인하세요. 반대로 서운한 것을 계속 참다가 한 번에 폭발하는 패턴이 있다면 불편이 3 정도일 때 말하는 연습이 더 좋습니다.</p><p><b>잘 맞는 사람</b>은 단순히 특정 띠보다 당신의 속도를 존중하면서 ${ELEMENT_TONE[low].good}을 자연스럽게 쓰는 사람입니다.</p></div>`;
  const family=`<div class="deep-topic"><span>가족 · 인간관계</span><h4>가까운 사람일수록 역할을 나누는 게 중요합니다</h4><p>${high==='토'?'가족 안에서 버팀목·해결사 역할을 맡기 쉽습니다.':high==='수'?'분위기를 먼저 읽고 갈등이 커지기 전에 조정하는 역할을 맡기 쉽습니다.':high==='화'?'분위기를 살리고 사람을 움직이는 역할을 맡기 쉽습니다.':high==='금'?'기준을 세우고 잘못된 부분을 바로잡는 역할을 맡기 쉽습니다.':'사람을 챙기고 다음 방향을 제안하는 역할을 맡기 쉽습니다.'}</p><p><b>예를 들어</b> 가족의 병원예약·돈 문제·행정처리까지 늘 한 사람이 모두 맡고 있다면 “내가 잘하니까 내가 다 한다”보다 항목을 나눠 다른 사람에게 하나씩 맡기는 게 좋습니다. 책임을 나눈다고 애정이 줄어드는 것은 아닙니다.</p></div>`;
  return `<div class="deep-consult-grid v7-domain">${career}${money}${love}${family}</div>`;
}
function 상담성향(ec,c,dm){
  const sorted=Object.entries(c).sort((a,b)=>b[1]-a[1]),high=sorted[0][0],low=[...sorted].reverse()[0][0];
  return `<div class="fortune-reader talk-reader v7-reader"><div class="reader-mark">처음 사주 보러 왔다고 생각하고 이야기해볼게요</div><p>당신 사주의 중심은 <b>${dm.name||ganzhiKo(ec.getDayGan())}</b>입니다. ${dm.summary||''} 이 말이 어렵게 들리면 “나는 기본적으로 어떤 방식으로 세상을 보고 움직이는가”를 나타내는 출발점이라고 생각하면 됩니다.</p><p>그런데 일간만 보면 사람을 너무 단순하게 봅니다. 여덟 글자를 같이 놓고 보면 <b>${high} 기운이 가장 강하고 ${low} 기운은 상대적으로 적게</b> 나타납니다. 그래서 ${ELEMENT_TONE[high].good}은 자연스럽게 쓰는 반면, ${ELEMENT_TONE[low].good}은 의식하지 않으면 뒤로 밀릴 수 있습니다.</p><p><b>실제 생활 예를 하나 들어볼게요.</b> 일이 꼬였을 때 당신은 ${ELEMENT_LIFE_EXAMPLE[high]} 같은 방식으로 먼저 해결하려는 경향이 있습니다. 그런데 그 방법으로도 안 풀릴 때는 ${ELEMENT_LIFE_EXAMPLE[low]}을 일부러 써보면 균형이 생깁니다.</p><div class="reader-em"><b>정리하면</b><br>강한 ${high}을 없애는 게 아니라 잘 쓰고, 부족한 ${low}을 필요할 때 꺼내 쓰는 사람이 되는 게 핵심입니다. 오행은 점수표가 아니라 내가 자주 쓰는 방식과 덜 쓰는 방식을 보여주는 지도에 가깝습니다.</div></div>`;
}
async function buildLocalLlmPrompt(){
  const p=profile();if(!p)throw Error('프로필을 먼저 저장하세요.');
  const ec=ecFromSolar(solarFromProfile(p),p),now=new Date().getFullYear(),ld=currentLuckData(ec,p,now),years=[];
  for(let y=now;y<now+5;y++){const x=v7yearCounsel(ec,p,y);years.push({year:y,grade:x.d.grade.label,relation:x.d.rel,interaction:x.d.it.type,summary:x.overall,career:x.career,money:x.money,relation_text:x.relation})}
  return `당신은 한국어로 설명하는 차분한 사주 상담 해설자입니다. 아래 계산값은 전통 명리 규칙 엔진이 만든 사실 데이터입니다. 계산값을 바꾸거나 새로운 사건을 예언하지 마세요. 같은 말을 반복하지 말고, 실제 상담하듯 자연스럽고 부드러운 한국어로 1200~1800자 정도로 정리하세요. 올해와 내년을 반드시 서로 다른 이유로 설명하고, 직장/돈/관계에서 각각 구체적인 생활 사례를 하나씩 들어주세요. 의학·투자·법률의 결과를 단정하지 마세요.\n\n이름:${p.name||'사용자'}\n원국:${ganzhiKo(ec.getYear())}/${ganzhiKo(ec.getMonth())}/${ganzhiKo(ec.getDay())}/${p.timeKnown==='unknown'?'시주미상':ganzhiKo(ec.getTime())}\n일간:${ganzhiKo(ec.getDayGan())}\n현재대운:${ld.cur?`${ld.cur.sy}-${ld.cur.ey} ${ganzhiKo(ld.cur.gz)}`:'미상'}\n다음대운:${ld.next?`${ld.next.sy}-${ld.next.ey} ${ganzhiKo(ld.next.gz)}`:'미상'}\n연도자료:${JSON.stringify(years)}`;
}
async function runLocalLlm(){
  const btn=$('#localLlmBtn'),status=$('#localLlmStatus'),out=$('#localLlmResult');if(!btn||!status||!out)return;
  btn.disabled=true;status.textContent='로컬 AI 모듈을 준비하고 있습니다. 처음에는 모델 다운로드 때문에 오래 걸릴 수 있습니다.';
  try{
    if(!('gpu' in navigator)) throw Error('이 기기/브라우저에서는 WebGPU를 사용할 수 없습니다. 기본 상담 해설은 그대로 이용할 수 있습니다.');
    const webllm=await import('https://esm.run/@mlc-ai/web-llm');
    const list=webllm.prebuiltAppConfig?.model_list||[];
    const pref=list.find(x=>/Qwen2\.5-0\.5B-Instruct.*q4f16_1/i.test(x.model_id||''))||list.find(x=>/0\.5B.*Instruct/i.test(x.model_id||''))||list.find(x=>/1B.*Instruct/i.test(x.model_id||''));
    if(!pref)throw Error('현재 WebLLM 목록에서 가벼운 한국어 대응 모델을 찾지 못했습니다.');
    const prompt=await buildLocalLlmPrompt();
    const engine=await webllm.CreateMLCEngine(pref.model_id,{initProgressCallback:(r)=>{status.textContent=`모델 준비 중 · ${r.text||Math.round((r.progress||0)*100)+'%'}`}});
    status.textContent='사주 계산값을 바꾸지 않고 상담 문장만 자연스럽게 다듬는 중입니다.';
    const res=await engine.chat.completions.create({messages:[{role:'system',content:'계산된 명리 데이터를 왜곡하지 않고 한국어 상담문으로 재구성한다.'},{role:'user',content:prompt}],temperature:0.55,max_tokens:1800});
    const text=res.choices?.[0]?.message?.content||'';if(!text)throw Error('로컬 모델이 결과를 만들지 못했습니다.');
    out.hidden=false;out.innerHTML=`<b>로컬 AI 상담 정리</b><p>${text.replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br>')}</p>`;status.textContent=`완료 · ${pref.model_id}`;
  }catch(e){status.textContent=`로컬 AI 사용 불가: ${e.message}`;out.hidden=true}
  finally{btn.disabled=false}
}
function bindV7Llm(){const b=$('#localLlmBtn');if(b&&!b.dataset.bound){b.dataset.bound='1';b.onclick=runLocalLlm}}
const renderProfileV7Base=renderProfile;
renderProfile=function(){renderProfileV7Base();setTimeout(bindV7Llm,0)};

function answer(){
  const p=profile(),q=$('#askText').value.trim();if(!p)return alert('내 사주를 먼저 등록하세요.');if(!q)return alert('질문을 입력하세요.');
  const c=classifyQuestion(q);
  try{
    const i=dayInfo(todayYmd(),p);let score=purposeScore(i,c.purpose);if(c.risky)score=Math.min(score,68);const ch=choice(score,c.risky),basis=whyText(i,c.purpose),seed=`${q}-${todayYmd()}-${i.rel}-${i.inter.type}`;
    const open=c.risky?'이 질문은 사주보다 현실 정보가 먼저입니다. 명리는 마음을 정리하는 참고 정도로만 보세요.':v7pick(seed,['이 질문은 너무 거창하게 볼 필요는 없어요. 현실 조건과 오늘의 흐름을 같이 놓고 보면 이렇습니다.','먼저 현실적인 부분부터 보고, 그 다음 오늘의 명리 흐름을 겹쳐볼게요.','이건 “운이 좋으니 무조건 한다”보다, 지금 해도 부담이 적은지부터 보는 게 맞습니다.']);
    const specific=recommendationText(c.type,i,score,c.risky);
    const example=c.type==='가벼운 호의'?'예를 들어 동료가 바쁘지 않아 보이면 “이거 같이 먹어요”라고 가볍게 건네고, 반응이 좋을 때만 대화를 이어가면 됩니다.':c.type==='대화'?'예를 들어 중요한 부탁이라면 메시지로 길게 설명하기보다 핵심 한두 줄을 먼저 보내고 “잠깐 이야기할 시간 괜찮아요?”라고 시간을 잡는 편이 낫습니다.':c.type==='계약'?'예를 들어 계약서를 받았다면 금액만 보지 말고 해지조건·책임범위·자동갱신 여부를 표시해놓고 한 번 더 읽으세요.':c.type==='만남'?'예를 들어 첫 약속이라면 긴 일정 대신 1~2시간 정도의 가벼운 만남으로 시작해 서로의 리듬을 확인하는 편이 좋습니다.':'작게 실행한 뒤 반응을 확인하고 다음 행동을 정하는 방식이 가장 안전합니다.';
    $('#askResult').hidden=false;
    $('#askResult').innerHTML=`<span class="badge">${c.type} 질문</span><div class="label" style="margin-top:12px">오늘의 선택</div><div class="big-choice ${ch.cls}">${ch.title}</div><p>${open}</p><div class="reasonbox"><b>현실적으로 보면</b>${realityText(c.type,q,c.risky)}</div><div class="reasonbox"><b>오늘의 흐름을 겹쳐보면</b>${i.inter.text}. ${basis[1]||''}</div><div class="reasonbox"><b>그래서 이렇게 해보세요</b>${specific}</div><div class="mini-example"><b>실제 상황 예시</b>${example}</div><details><summary>판단 근거 보기</summary><p class="small">${basis.join('<br>')}</p><p class="fade-note">내부 명리지수 ${score}/100은 성공확률이 아니라 규칙 비교용 보조값입니다.</p></details>`;
  }catch(e){alert(e.message)}
}
function findDates(){
  const p=profile();if(!p)return alert('내 사주를 먼저 등록하세요.');const a=$('#fromDate').value,b=$('#toDate').value,purpose=$('#purpose').value;if(!a||!b||a>b)return alert('기간을 확인하세요.');const start=new Date(a+'T12:00'),end=new Date(b+'T12:00');if((end-start)/864e5>90)return alert('한 번에 최대 90일까지 검색합니다.');
  const arr=[];for(let d=new Date(start);d<=end;d.setDate(d.getDate()+1)){const ds=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,i=dayInfo(ds,p);arr.push({ds,i,score:purposeScore(i,purpose)})}arr.sort((x,y)=>y.score-x.score);
  $('#dateResults').hidden=false;
  $('#dateResults').innerHTML=`<h2>${purpose} 날짜를 이렇게 골라봤어요</h2><p class="muted small">1위가 무조건 성공하는 날이라는 뜻은 아닙니다. 내 사주와 날짜의 관계가 비교적 부드러운 날을 먼저 추린 뒤, 실제 일정·비용·상대 사정을 함께 보세요.</p>${arr.slice(0,7).map((x,n)=>{const g=grade(x.score),why=whyText(x.i,purpose),acts=translateActs(x.i.yi,3),seed=`${x.ds}-${purpose}`,use=v7pick(seed,['오전부터 일정을 너무 촘촘히 잡지 말고 중요한 일정 전후에 여유 시간을 남겨두세요.','중요한 말은 그날 처음 생각하지 말고 전날 핵심을 한두 줄로 정리해두세요.','상대가 있는 일정이라면 내 날짜보다 상대 컨디션과 시간 가능 여부를 먼저 확인하세요.']);return `<div class="date-card"><div class="rank">${n+1}위 · ${ganzhiKo(x.i.ec.getDay())}</div><div class="date">${formatDateKo(x.ds)}</div><span class="grade-pill ${g.cls}">${g.label}</span><div class="why" style="margin-top:10px"><b>왜 이 날을 골랐나요?</b><br>${why.slice(0,3).join('<br>')}</div><div class="mini-example"><b>이 날을 쓴다면</b>${use}</div>${acts.length?`<div class="why" style="margin-top:8px"><b>전통력에서 겹치는 생활 항목</b><br>${acts.join(' · ')}</div>`:''}<details><summary>전문 정보</summary><p class="small">일진 ${ganzhiKo(x.i.ec.getDay())} · ${x.i.inter.type} · 일간 관계 ${x.i.rel}<br>내부 명리지수 ${x.score}/100</p></details></div>`}).join('')}`;
}
function match(){
  const p=profile(),ob=$('#otherBirth').value;if(!p)return alert('내 사주를 먼저 등록하세요.');if(!ob)return alert('상대 생년월일을 입력하세요.');
  try{
    const e1=ecFromSolar(solarFromProfile(p),p),{y,m,d}=ymd(ob),[h,mi]=($('#otherTime').value||'12:00').split(':').map(Number),e2=Solar.fromYmdHms(y,m,d,h,mi,0).getLunar().getEightChar(),inter=interaction(e1.getDayZhi(),e2.getDayZhi()),a=ELS[e1.getDayGan()],b=ELS[e2.getDayGan()],n1=p.name||'나',n2=$('#otherName').value||'상대';
    const rel=a===b?'두 사람 모두 비슷한 방식으로 감정과 일을 처리하려는 경향이 있어 처음에는 편하지만, 의견이 갈릴 때 서로 양보를 기다릴 수 있습니다.':GEN[a]===b?`${n1}의 말이나 행동이 ${n2}에게 자극과 추진력이 되기 쉽습니다. 다만 한쪽이 계속 끌고 가는 구조가 되지 않도록 역할을 바꿔보는 게 좋습니다.`:GEN[b]===a?`${n2}가 ${n1}에게 아이디어·정서·실질적인 도움을 주는 느낌이 생기기 쉽습니다. 도움받는 쪽도 필요한 것을 말로 표현해야 균형이 맞습니다.`:CTRL[a]===b?`${n1}이 기준이나 방향을 잡으려는 모습이 강해질 수 있습니다. 상대가 통제받는다고 느끼지 않도록 “왜 이렇게 해야 하는지”를 설명하는 게 중요합니다.`:CTRL[b]===a?`${n1}은 ${n2}의 기준이나 요구를 압박처럼 느낄 때가 있을 수 있습니다. 부탁과 명령을 구분하고 서로 가능한 범위를 말로 정하는 게 필요합니다.`:'두 사람의 방식이 다르기 때문에 처음에는 낯설어도 역할이 잘 나뉘면 서로 보완될 수 있습니다.';
    const conflict=inter.type==='충'?'예를 들어 약속시간이나 돈 쓰는 문제로 부딪혔을 때 “너는 원래 그래”라고 성격을 단정하기보다, 이번 상황에서 무엇이 불편했는지만 말하는 게 좋습니다. 감정이 큰 날에는 결론을 하루 미루는 것도 방법입니다.':inter.type==='합'?'예를 들어 여행·공동구매·집안일처럼 같이 결정할 일이 있을 때 역할과 마감만 분명히 하면 협업의 장점이 잘 살아날 수 있습니다. 다만 서로 잘 맞는다고 생각해 중요한 조건을 생략하지는 마세요.':'예를 들어 연락 빈도나 혼자 있는 시간이 다르면 “왜 나만 노력해?”라고 해석하기보다 각자 편한 빈도를 구체적으로 맞춰보는 게 좋습니다.';
    const practical=`대화 규칙을 하나 정해보세요. 다툴 때는 과거 일을 한꺼번에 꺼내지 않고 지금 문제 하나만 말하기, 돈 문제는 금액과 기한을 문자로 남기기, 큰 결정은 둘 다 동의할 때만 확정하기 같은 방식이 실제 궁합을 훨씬 좋게 만듭니다.`;
    $('#matchResult').hidden=false;$('#matchResult').innerHTML=`<h2>${n1} × ${n2}</h2><p>두 사람 궁합은 “몇 점”보다 <b>어디에서 편하고 어디에서 자주 오해하는지</b>를 보는 게 더 실용적입니다.</p><div class="reasonbox"><b>두 사람의 기본 리듬</b>${rel}</div><div class="reasonbox"><b>갈등이 생기면 이런 장면이 나올 수 있어요</b>${conflict}</div><div class="reasonbox"><b>실제로 관계를 편하게 만드는 방법</b>${practical}</div><details><summary>전문 명리 정보 보기</summary><p class="small">일주 ${ganzhiKo(e1.getDay())} × ${ganzhiKo(e2.getDay())}<br>일지 관계 ${inter.type}<br>일간 오행 ${a} × ${b}</p></details><p class="fade-note">궁합은 관계의 우열이나 미래를 확정하는 값이 아닙니다.</p>`;
  }catch(e){alert(e.message)}
}

/* ===== 오늘결 9.0: 실전 대화상담 엔진 ===== */
const ASK9_INTENTS=[
  {id:'소개팅',re:/소개팅|첫\s*만남|처음\s*만나|소개받/,purpose:'소개팅·만남'},
  {id:'데이트',re:/데이트|연애.*약속|둘이.*만나|저녁.*만나/,purpose:'소개팅·만남'},
  {id:'고백',re:/고백|좋아한다고|마음.*말|사귀자/,purpose:'소개팅·만남'},
  {id:'약속잡기',re:/약속.*잡|만나도|만날까|시간.*잡|일정.*잡/,purpose:'소개팅·만남'},
  {id:'사과화해',re:/사과|화해|미안|풀어|서운.*말/,purpose:'중요한 대화'},
  {id:'직장대화',re:/팀장|상사|부장|과장|동료|회사|직장|보고|건의|요청|면담/,purpose:'중요한 대화'},
  {id:'중요대화',re:/중요한.*이야기|꺼내.*말|말해도|얘기해도|대화.*해도|설득|부탁/,purpose:'중요한 대화'},
  {id:'계약',re:/계약|서명|약정|거래|합의서|계약서/,purpose:'계약·거래'},
  {id:'구매',re:/사도|구매|결제|차.*살|집.*살|중고|예약금|계약금/,purpose:'계약·거래'},
  {id:'면접지원',re:/면접|지원서|이력서|입사지원|원서|발표/,purpose:'중요한 대화'},
  {id:'시험공부',re:/시험|공부|과제|자격증|복습/,purpose:'정리·휴식'},
  {id:'호의',re:/과자|간식|커피|차를|밥|식사|선물|사주고|건네|챙겨/,purpose:'중요한 대화'},
  {id:'연락',re:/연락|문자|카톡|전화|메시지/,purpose:'중요한 대화'},
  {id:'이동',re:/이사|이동|여행|출발|출장|운전/,purpose:'이사·이동'},
  {id:'휴식정리',re:/쉬어|휴식|정리|청소|정돈|미뤄둔/,purpose:'정리·휴식'}
];
function ask9Intent(q){
  const risky=/주식|코인|투자|매수|매도|대출|수술|복용|약을|응급|병원|진단|법률|고소|소송|해고|사직서/.test(q);
  const hit=ASK9_INTENTS.find(x=>x.re.test(q))||{id:'일반선택',purpose:'중요한 대화'};
  return {...hit,risky};
}
function ask9Signals(i){
  const yi=translateActs(i.yi,6),ji=translateActs(i.ji,6);
  return {inter:i.inter.type,rel:i.rel,yi,ji};
}
function ask9Outcome(intent,score,risky){
  if(risky)return {title:'사주보다 현실 조건부터 보세요',cls:'choice-warn'};
  const good=score>=78,mid=score>=66;
  const map={
    소개팅:good?'약속을 잡아도 괜찮아요':mid?'가볍게 약속을 잡아보세요':'오늘 바로 확정할 필요는 없어요',
    데이트:good?'만나기 좋은 편이에요':mid?'무리 없는 일정이면 괜찮아요':'상대 컨디션부터 확인해보세요',
    고백:good?'마음을 꺼내볼 수 있는 날이에요':mid?'분위기를 먼저 살펴보세요':'오늘은 결론보다 관계 확인이 먼저예요',
    약속잡기:good?'약속을 잡아도 좋습니다':mid?'시간부터 가볍게 물어보세요':'상대 일정 확인이 먼저예요',
    사과화해:good?'먼저 말을 건네볼 만해요':mid?'짧게 대화를 열어보세요':'감정이 가라앉은 뒤 말하는 편이 나아요',
    직장대화:good?'이야기를 꺼내볼 수 있어요':mid?'핵심만 정리해 말해보세요':'오늘은 자료를 먼저 정리하는 편이 낫습니다',
    중요대화:good?'말을 꺼내도 괜찮아요':mid?'대화는 가능해요. 결론은 천천히':'오늘은 먼저 상대 반응을 확인하세요',
    계약:'계약은 운보다 조건 확인이 먼저예요',
    구매:'오늘 사도 되는지는 가격과 조건부터 보세요',
    면접지원:good?'지원·면접 행동으로 옮겨볼 만해요':mid?'준비한 만큼 시도해보세요':'제출 전 한 번 더 점검하세요',
    시험공부:good?'집중할 일을 하나 정해 시작해보세요':mid?'분량을 줄여 꾸준히 하세요':'무리한 몰아치기보다 복습이 낫습니다',
    호의:good?'가볍게 건네보세요':mid?'부담 없이 챙겨줘도 괜찮아요':'상대가 바쁘지만 않은지 먼저 보세요',
    연락:good?'먼저 연락해도 괜찮아요':mid?'짧게 안부부터 물어보세요':'답을 재촉하지 않는 연락이 좋아요',
    이동:good?'준비만 되어 있다면 움직여도 괜찮아요':mid?'시간 여유를 두고 움직이세요':'일정과 교통부터 다시 확인하세요',
    휴식정리:good?'오늘 정리해두면 마음이 가벼워질 수 있어요':mid?'작은 것 하나만 정리해보세요':'쉬는 것도 일정으로 잡아두세요',
    일반선택:good?'해볼 만합니다':mid?'무난합니다':'조금 더 확인해보세요'
  };
  return {title:map[intent]||map.일반선택,cls:good?'choice-good':mid?'choice-neutral':'choice-warn'};
}
function ask9Reality(intent,q){
  const map={
    소개팅:'소개팅은 날짜보다 서로 부담 없이 만날 수 있는지가 더 중요해요. 첫 만남이라면 1~2시간 정도의 짧은 일정, 대화하기 편한 장소, 귀가가 늦지 않는 시간이 좋습니다.',
    데이트:'데이트는 “오늘 운이 좋은가”보다 둘 다 피곤하지 않은지, 시간에 쫓기지 않는지가 훨씬 중요합니다. 일정이 빡빡하면 좋은 분위기도 쉽게 지칩니다.',
    고백:'고백은 상대가 이미 나와 편하게 대화하고 있는지, 단둘이 시간을 보내는 걸 부담스러워하지 않는지를 먼저 보는 게 좋아요. 상대 신호가 거의 없는데 운만 믿고 밀어붙이는 건 추천하지 않습니다.',
    약속잡기:'약속을 잡을 때는 날짜부터 정하기보다 “이번 주나 다음 주 중 편한 날 있어?”처럼 선택권을 주는 편이 자연스럽습니다. 상대가 바쁘면 날짜 확정을 재촉하지 않아도 됩니다.',
    사과화해:'사과나 화해는 누가 맞는지 다시 따지는 자리보다, 내가 어떤 부분을 미안하게 생각하는지 한 가지를 정확히 말하는 게 효과적입니다. “그런 뜻은 아니었어”보다 “그 말은 내가 지나쳤어”가 더 잘 전달됩니다.',
    직장대화:'직장 이야기는 타이밍보다 준비가 중요합니다. 요구사항을 하나로 줄이고, 근거가 필요한 이야기라면 숫자·일정·사례를 한두 개 준비하세요. 감정만 전달하면 상대가 무엇을 해줘야 하는지 모를 수 있습니다.',
    중요대화:'중요한 대화는 한 번에 모든 문제를 해결하려 하면 무거워집니다. 오늘 꼭 전달해야 할 핵심 하나와, 나중에 다시 이야기해도 되는 내용을 나누는 편이 좋습니다.',
    계약:'계약은 사주로 진행 여부를 정하면 안 됩니다. 금액, 기간, 해지·환불 조건, 자동갱신, 책임 범위, 위약금 같은 문구를 실제 문서에서 확인하는 것이 먼저입니다.',
    구매:'구매는 “오늘 사도 되는가”보다 지금 가격이 합리적인지, 유지비가 얼마나 드는지, 환불이 가능한지부터 보세요. 특히 큰돈이면 하루 정도 비교할 시간을 두는 게 좋습니다.',
    면접지원:'지원이나 면접은 완벽해질 때까지 기다리는 것보다 기준을 충족했다면 실제로 제출하고 경험을 쌓는 편이 낫습니다. 다만 오탈자·경력기간·연락처 같은 기본 오류는 제출 전 꼭 확인하세요.',
    시험공부:'공부는 운보다 반복량이 결과를 만듭니다. 오늘 컨디션이 좋지 않아도 핵심 문제 20개, 복습 30분처럼 최소 단위를 정하면 흐름을 이어갈 수 있습니다.',
    호의:'작은 간식이나 커피는 가격보다 태도가 중요합니다. “이거 드세요”라고 부담 없이 건네고, 상대가 바빠 보이면 대화를 길게 붙잡지 않는 정도면 충분합니다.',
    연락:'연락은 상대가 답할 여지를 남기는 게 중요해요. 답이 늦다고 추가 메시지를 연달아 보내기보다 첫 메시지에 안부와 용건을 짧게 담는 편이 좋습니다.',
    이동:'이동은 날씨·교통·예약·출발 여유시간이 핵심입니다. 중요한 일정이면 도착 목표를 실제 시작시간보다 20~30분 앞당겨 잡는 게 안전합니다.',
    휴식정리:'쉬거나 정리하는 건 미루기 쉬워서 범위를 작게 정하는 게 좋습니다. 방 전체가 아니라 책상 하나, 하루 전체가 아니라 30분처럼 시작점을 줄이면 실제로 하게 됩니다.'
  };
  return map[intent]||'운보다 먼저 현실 조건을 확인하세요. 상대가 있는 일이라면 상대 일정과 의사를, 돈이 드는 일이라면 비용과 되돌릴 수 있는지를 먼저 보는 것이 좋습니다.';
}
function ask9Myeongri(intent,i){
  const interMap={
    합:'오늘은 당신의 일주와 합의 관계가 잡힙니다. 전통 명리에서는 이런 날을 사람이나 일이 서로 연결되기 쉬운 쪽으로 읽기도 합니다. 다만 합은 “무조건 좋은 날”이 아니라 서로 묶이는 힘이 있다는 뜻이라, 관계를 서두르기보다 자연스럽게 이어가는 식으로 쓰는 게 맞습니다.',
    충:'오늘은 당신의 일주와 충의 관계가 잡힙니다. 충은 무조건 나쁜 뜻이라기보다 움직임·변화·엇갈림이 커지는 신호로 봅니다. 그래서 새로운 말을 꺼내거나 일정을 바꾸는 일은 가능하지만, 감정이 올라온 상태에서 결론까지 한 번에 내리는 건 피하는 편이 낫습니다.',
    평:'오늘은 당신의 일주와 큰 합·충이 두드러지지 않습니다. 이런 날은 운이 일을 끌고 간다기보다 준비한 만큼 결과가 나오는 평범한 날로 보는 편이 자연스럽습니다.'
  };
  const relMap={지원:'오늘의 천간 관계는 ‘지원’ 쪽입니다. 누군가의 도움을 받거나 상대 말을 받아들이는 쪽에 힘이 실리기 쉬워요.',표현:'오늘의 천간 관계는 ‘표현’ 쪽입니다. 말·발표·연락처럼 안에 있던 것을 밖으로 꺼내는 행동과 연결해서 볼 수 있습니다.',동질:'오늘은 내 페이스를 유지하려는 힘이 강한 편입니다. 남에게 맞추기보다 내가 원하는 방식이 분명해질 수 있어요.',관리:'오늘은 조건·돈·일정처럼 현실적인 요소를 정리하는 쪽에 무게가 실립니다. 감정보다 체크리스트가 더 도움이 되는 날입니다.',압박:'오늘은 책임이나 요구를 평소보다 크게 느낄 수 있는 흐름입니다. 해야 할 일을 너무 많이 잡으면 작은 일에도 예민해질 수 있으니 범위를 줄이는 게 좋습니다.',중립:'오늘은 특정 방향의 기운보다 현실 조건이 더 중요하게 작용하는 날입니다.'};
  return `${interMap[i.inter.type]||interMap.평} ${relMap[i.rel]||relMap.중립}`;
}
function ask9Action(intent,i,score){
  const positive=i.inter.type==='합'||score>=78;
  const map={
    소개팅:positive?'상대에게 “이번 주나 다음 주 중 편한 날 있으면 커피 한잔할래요?” 정도로 가볍게 물어보세요. 첫 만남은 저녁 늦게까지 잡기보다 카페나 식사처럼 끝나는 시간이 보이는 일정이 좋습니다.':'소개팅 자체를 미룰 필요는 없지만 오늘 당장 날짜를 확정하려 애쓰지 마세요. 상대가 가능한 요일을 먼저 물어보고, 답이 오면 그중 한 날을 고르는 식이면 충분합니다.',
    데이트:positive?'너무 특별한 이벤트보다 대화하기 편한 식사나 산책처럼 상대와 호흡을 볼 수 있는 일정을 잡아보세요.':'둘 다 바쁜 날이라면 억지로 긴 데이트를 만들기보다 짧게 만나거나 다음 날로 넘기는 게 낫습니다.',
    고백:positive?'고백부터 꺼내기보다 둘의 관계를 한 번 확인하는 말을 먼저 해보세요. “나는 너랑 둘이 만나는 시간이 좋은데 너는 어때?”처럼 상대가 답할 공간을 주는 방식이 좋습니다.':'오늘 감정이 많이 올라와 있다면 결론형 고백은 하루 미루고, 먼저 둘이 편하게 대화할 시간을 만드는 쪽이 낫습니다.',
    약속잡기:'“언제 돼?”보다 “나는 수·금 저녁 괜찮은데 너는 언제 편해?”처럼 내 가능 시간도 같이 제안해보세요. 상대가 결정하기 쉬워집니다.',
    사과화해:positive?'먼저 연락해서 “내가 그때 한 말은 미안해. 변명하려는 건 아니고 그 부분은 사과하고 싶었어.”처럼 사과할 한 가지를 분명히 말해보세요.':'지금 바로 긴 메시지를 보내기보다 사과할 핵심을 먼저 메모해보세요. 감정이 가라앉은 뒤 짧고 분명하게 전달하는 편이 낫습니다.',
    직장대화:positive?'오늘 이야기한다면 “지금 문제는 A이고, 제가 원하는 건 B입니다”처럼 두 문장으로 시작하세요. 예를 들어 업무량 이야기라면 불만만 말하기보다 현재 업무 5개 중 우선순위를 정해달라고 요청하는 방식이 좋습니다.':'오늘은 바로 요구하기보다 근거를 정리하세요. 예를 들어 인력 부족을 말하려면 최근 한 달 초과업무 시간이나 미처리 건수를 적어두면 다음 대화가 훨씬 쉬워집니다.',
    중요대화:positive?'대화를 시작해도 좋습니다. 다만 시작부터 결론을 요구하지 말고 “내가 생각한 게 있는데 10분 정도 이야기해도 괜찮아?”라고 상대 준비부터 확인하세요.':'말을 아예 미룰 필요는 없지만 오늘은 핵심만 전달하고 답을 기다리세요. 상대가 즉시 결론을 못 내도 재촉하지 않는 게 좋습니다.',
    계약:'진행한다면 계약서에서 금액·기간·해지·위약금·자동갱신을 직접 표시하세요. 구두로 들은 내용이 문서에 없다면 서명 전에 넣어달라고 요청하는 게 맞습니다.',
    구매:'구매 전 “지금 꼭 필요한가 / 더 싼 대안이 있는가 / 1년 유지비는 얼마인가 / 환불 가능한가” 네 가지를 확인하세요. 네 가지 중 하나라도 답이 अस्पष्ट하면 바로 결제하지 않는 편이 낫습니다.',
    면접지원:positive?'오늘은 지원서를 실제로 내거나 면접 일정을 잡아볼 만합니다. 자기소개에서 추상적인 장점보다 “제가 맡은 뒤 처리시간을 20% 줄였다”처럼 숫자나 사례 하나를 넣어보세요.':'지원 자체를 포기할 필요는 없습니다. 오늘은 이력서의 최근 경력·성과·오탈자를 점검하고 다음 가능한 제출일을 정하세요.',
    시험공부:'오늘은 새 내용을 많이 벌이기보다 시험에 자주 나오는 핵심 문제를 먼저 풀고 틀린 것만 다시 보는 방식이 효율적입니다.',
    호의:positive?'그냥 “이거 같이 먹어요”라고 건네세요. 상대가 웃으며 대화를 이어오면 잠깐 이야기하고, 바빠 보이면 간식만 두고 자리를 비켜주는 정도가 가장 자연스럽습니다.':'간식은 건네도 괜찮습니다. 다만 그걸 계기로 꼭 대화를 길게 이어가야 한다고 생각하지 마세요. 상대 반응에 맞추면 됩니다.',
    연락:positive?'안부 한 줄과 용건 한 줄이면 충분합니다. 예: “요즘 잘 지내? 생각나서 연락했어. 시간 괜찮을 때 커피 한잔할래?”처럼 답할 여지를 주세요.':'연락은 해도 되지만 답을 빨리 받아야 한다는 기대는 내려놓는 게 좋습니다. 한 번 보내고 기다리세요.',
    이동:'출발시간을 넉넉하게 잡고 예약·교통·날씨를 먼저 확인하세요. 중요한 일정이면 20~30분 일찍 도착하는 기준으로 잡는 편이 좋습니다.',
    휴식정리:'오늘은 한 가지 공간이나 한 가지 일만 정리하세요. 예를 들어 책상 서랍 하나를 비우거나 카드 자동결제 목록 하나를 정리하는 식이면 충분합니다.'
  };
  return map[intent]||'작게 실행하고 반응을 본 뒤 다음 행동을 정하세요. 한 번의 선택에 너무 큰 의미를 두지 않는 게 좋습니다.';
}
function ask9Examples(intent,q){
  const map={
    소개팅:['상대가 “주말은 바쁘고 평일 저녁은 괜찮아요”라고 하면 바로 토요일을 고집하지 말고 평일 1시간 커피처럼 상대가 편한 조건을 받아주는 식입니다.','첫 만남부터 하루 종일 데이트 코스를 짜기보다 카페나 식사 한 곳만 정해두면 서로 부담이 적습니다.'],
    계약:['예를 들어 헬스장이나 렌탈 계약이라면 월요금보다 중도해지 수수료와 자동연장 여부를 먼저 보는 식입니다.','중고거래라면 “오늘 운이 좋다”보다 제품 상태·보증·환불 가능 여부를 확인하는 게 우선입니다.'],
    직장대화:['업무가 너무 많다면 “힘들어요”보다 “현재 A·B·C 세 업무가 겹쳐 이번 주 마감이 어렵습니다. 우선순위를 정해주시면 그 순서대로 하겠습니다”라고 말하는 식입니다.','연봉이나 역할을 이야기한다면 감정 대신 지난 6개월의 성과와 추가 책임을 먼저 정리해두는 편이 좋습니다.'],
    중요대화:['연인에게 서운한 점을 말할 때 “넌 항상 그래”보다 “어제 약속이 바뀌었는데 연락이 늦어서 나는 서운했어”라고 한 사건만 말하는 식입니다.','부모님과 돈 이야기를 해야 한다면 감정부터 꺼내기보다 필요한 금액·기한·내가 부담할 부분을 먼저 정리해놓는 식입니다.'],
    고백:['둘이 이미 자주 만나고 연락도 자연스럽다면 “나는 우리 관계를 조금 더 진지하게 생각하고 있어”처럼 현재 마음을 말하고 상대 생각을 묻는 방식이 좋습니다.','상대가 최근 연락을 자주 피한다면 고백으로 관계를 뒤집으려 하기보다 먼저 지금 만남 자체를 편하게 느끼는지 확인하는 게 순서입니다.'],
    연락:['오랜만에 연락한다면 장문의 근황보다 “잘 지내? 갑자기 생각나서 연락했어” 정도로 시작하면 상대가 답하기 쉽습니다.','답이 몇 시간 늦었다고 “왜 답 없어?”를 이어 보내지 않고 다음 날까지 기다리는 식입니다.'],
    호의:['동료 책상에 간식을 두면서 “하나 더 있어서 가져왔어요” 정도로 말하면 상대가 부담을 느끼지 않습니다.','상대가 전화 중이거나 바빠 보이면 간식만 두고 나중에 자연스럽게 이야기하면 됩니다.']
  };
  return map[intent]||['작은 선택부터 해보고 결과를 확인한 뒤 다음 행동을 정하는 식이 가장 현실적입니다.'];
}
function answer(){
  const p=profile(),q=$('#askText').value.trim();if(!p)return alert('내 사주를 먼저 등록하세요.');if(!q)return alert('질문을 입력하세요.');
  const c=ask9Intent(q);
  try{
    const i=dayInfo(todayYmd(),p);let score=purposeScore(i,c.purpose);if(c.risky)score=Math.min(score,64);const out=ask9Outcome(c.id,score,c.risky),ex=ask9Examples(c.id,q),signals=ask9Signals(i),acts=signals.yi.slice(0,3);
    const intro=c.risky?'이건 운으로 밀어붙일 질문은 아니에요. 현실 조건부터 확인하고, 명리는 마음을 정리하는 참고 정도로만 보세요.':`${q.replace(/[?？]+$/,'')}라는 고민이라면, 저는 이렇게 볼게요. 먼저 현실적인 조건을 보고, 그 다음 오늘의 흐름이 그 선택과 잘 맞는지 겹쳐보는 방식입니다.`;
    const trad=acts.length?`오늘 전통력에서 겹치는 생활 항목으로는 ${acts.join('·')}가 잡힙니다. 이것도 단독으로 길흉을 정하는 기준은 아니고, 오늘 행동의 결을 참고하는 정도로 보세요.`:'전통력의 권장 항목은 이번 질문과 직접 겹치는 것이 뚜렷하지 않습니다. 그래서 오늘은 사주보다 현실 조건을 더 크게 보는 편이 맞습니다.';
    $('#askResult').hidden=false;
    $('#askResult').innerHTML=`<span class="badge">${c.id} 상담</span><div class="label" style="margin-top:12px">오늘의 결론</div><div class="big-choice ${out.cls}">${out.title}</div><p>${intro}</p><div class="reasonbox"><b>먼저 현실에서는 이렇게 봅니다</b>${ask9Reality(c.id,q)}</div><div class="reasonbox"><b>오늘 사주 흐름을 같이 놓고 보면</b>${ask9Myeongri(c.id,i)}</div><div class="reasonbox"><b>제가 실제로 권한다면</b>${ask9Action(c.id,i,score)}</div><div class="mini-example"><b>상황을 하나 들어볼게요</b>${ex[0]}${ex[1]?`<br><br>${ex[1]}`:''}</div><div class="reasonbox"><b>전통력에서는</b>${trad}</div><details><summary>왜 이렇게 봤는지 전문 근거</summary><p class="small">오늘 일진 ${ganzhiKo(i.ec.getDay())}<br>내 일주와의 관계 ${i.inter.type}<br>오늘 천간과 내 일간의 관계 ${i.rel}<br>${whyText(i,c.purpose).join('<br>')}</p><p class="fade-note">내부 비교값 ${score}/100은 성공확률이 아닙니다. 합이 항상 좋고 충이 항상 나쁜 것도 아니며, 실제 선택은 현실 조건을 함께 봐야 합니다.</p></details>`;
  }catch(e){alert(e.message)}
}
