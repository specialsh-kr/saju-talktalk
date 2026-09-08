// 오늘결 12.0 · 생각해서 말하는 상담 엔진
(()=>{
'use strict';
const $q=s=>document.querySelector(s);
const HISTORY_KEY='todaygyeol.v12.ask.history';
const COUNTER_KEY='todaygyeol.v12.ask.counter';
const WEEK=['일','월','화','수','목','금','토'];

const LEADS=[
  '이 질문은 운세 한 줄로 자르기보다 상황을 두 겹으로 봐야 합니다.',
  '이건 날짜만 좋은지 보는 질문이 아니라, 지금 관계 단계와 타이밍을 같이 봐야 해요.',
  '여기서는 사주보다 먼저 현실 조건을 정리하고, 그 다음 오늘 흐름을 얹어보겠습니다.',
  '제가 상담실에서 이 질문을 받았다면 먼저 “지금 무엇을 결정하려는가”부터 확인했을 겁니다.',
  '이 질문은 결론보다 순서가 중요합니다. 먼저 현실을 보고, 그다음 명리 흐름을 보죠.',
  '같은 질문이라도 관계 단계와 목적에 따라 답이 달라집니다. 이번에는 그 차이를 나눠서 볼게요.'
];
const TRANSITIONS=[
  '사주 쪽으로 넘어가 보면',
  '여기에 오늘의 명리 흐름을 겹쳐보면',
  '현실 이야기를 해봤으니 이제 사주에서는 무엇을 보는지 짚어볼게요.',
  '그다음으로 오늘 일진과 원국을 같이 놓고 보면',
  '이제 “왜 오늘 이런 조언을 하느냐”를 명리 쪽에서 설명해볼게요.'
];
const ENDINGS=[
  '오늘은 결론을 한 번에 내기보다, 작은 행동으로 현실 반응을 확인하고 다음 단계를 정하는 쪽이 더 자연스럽습니다.',
  '결국 운을 잘 쓰는 방법은 좋은 날을 기다리는 게 아니라, 오늘 가능한 행동을 작게 실행하고 결과를 보는 겁니다.',
  '사주는 방향을 고르는 보조표지판으로 쓰고, 마지막 결정은 상대의 반응과 실제 조건을 보고 정하세요.',
  '한마디로 정리하면, 오늘은 “확정”보다 “확인”에 강점을 두는 편이 좋습니다.',
  '이 흐름은 기회를 잡으라는 명령이 아니라, 어떤 방식으로 움직이면 마찰이 적은지를 보여주는 참고자료에 가깝습니다.'
];

const INTENTS=[
  ['소개팅',['소개팅','첫만남']],['데이트',['데이트']],['고백',['고백','사귀자','마음 전']],['연락',['연락','카톡','문자','전화']],
  ['화해',['화해','사과','미안','싸웠','갈등','서운']],['직장대화',['팀장','상사','동료','업무','보고','회의']],['이직',['이직','퇴사','사표','직장 옮']],
  ['승진',['승진','연봉협상','평가']],['면접',['면접','지원서','취업']],['시험',['시험','공부','자격증']],['계약',['계약','서명','거래','매매']],
  ['구매',['구매','살까','사도','차를 사','집을 사']],['투자',['주식','코인','투자','매수','매도']],['창업',['창업','사업','가게']],
  ['가족',['부모','엄마','아빠','가족','자녀','아이']],['이사',['이사','입주']],['여행',['여행','출장','출발']],['건강',['병원','수술','약','건강','아프']],
  ['약속',['약속','만날까','만남']],['중요대화',['중요한 이야기','얘기 꺼','말할까','대화할까','설득','부탁']],['일반',['할까','해도','좋을까']]
];

const REALITY={
  소개팅:[
    '소개팅은 “운이 좋은 날”보다 서로 부담 없이 만날 수 있는 시간과 첫 만남의 길이가 중요합니다. 처음부터 긴 코스를 잡기보다 60~120분 정도로 끝낼 수 있는 카페나 식사 한 곳이 안전합니다.',
    '첫 만남에서는 장소보다 대화가 잘 들리는 환경이 중요합니다. 너무 시끄럽거나 이동이 복잡한 곳보다, 한 자리에서 편하게 이야기할 수 있는 곳이 낫습니다.',
    '상대가 아직 낯선 단계라면 날짜를 일방적으로 정하기보다 두 개 정도 선택지를 주는 방식이 좋습니다. 상대가 고를 공간이 있어야 첫 인상이 부드럽습니다.'
  ],
  데이트:[
    '데이트는 일정 자체보다 둘의 체력과 분위기가 맞는지가 중요합니다. 여러 장소를 욕심내기보다 한두 개만 정하고 중간에 쉬어갈 여유를 두는 편이 좋습니다.',
    '이미 가까운 사이라면 특별한 이벤트보다 상대가 요즘 무엇에 지쳐 있는지를 먼저 보는 게 효과적입니다. 피곤한 사람에게 화려한 코스는 오히려 숙제가 됩니다.',
    '데이트를 잡을 때는 “무엇을 할까”보다 “얼마나 편하게 함께 있을 수 있나”를 기준으로 정하면 만족도가 올라갑니다.'
  ],
  고백:[
    '고백은 타이밍보다 관계 단계가 먼저입니다. 둘이 따로 만나는 일이 이미 자연스러운지, 상대도 먼저 연락하거나 시간을 내는지 같은 현실 신호를 확인하세요.',
    '마음을 전할 때는 결론을 강요하지 않는 게 중요합니다. “나는 이렇게 느끼는데 너는 어떻게 생각해?”처럼 상대가 답할 여지를 남기는 표현이 좋습니다.',
    '상대가 최근 거리감을 두거나 답이 짧아진 상태라면 고백으로 상황을 뒤집으려 하기보다 먼저 관계 온도를 확인하는 대화가 낫습니다.'
  ],
  연락:[
    '연락은 길게 보내는 것보다 답하기 쉬운 문장이 좋습니다. 안부 한 문장과 가벼운 질문 하나면 충분합니다.',
    '답장이 늦는다고 연속해서 메시지를 보내기보다 한 번 보낸 뒤 기다리는 편이 관계 부담을 줄입니다.',
    '오랜만의 연락이라면 바로 부탁이나 본론부터 꺼내지 말고, 안부와 연결 이유를 먼저 짧게 밝히는 편이 자연스럽습니다.'
  ],
  화해:[
    '화해는 누가 맞는지 판결하는 시간이 아니라 다시 대화가 가능한 상태를 만드는 과정입니다. 사실 하나, 내 감정 하나, 원하는 변화 하나만 말해보세요.',
    '사과할 때는 “그럴 의도는 아니었어”보다 상대가 실제로 겪은 불편을 인정하는 말이 먼저입니다. 해명은 그 다음이 낫습니다.',
    '갈등 직후 감정이 높은 상태라면 긴 대화보다 “지금은 감정이 올라와 있으니 조금 있다 다시 이야기하자”라고 시간을 정하는 게 더 효과적입니다.'
  ],
  직장대화:[
    '직장에서는 감정보다 상대가 판단할 수 있는 자료가 중요합니다. 일정, 업무량, 우선순위, 필요한 지원을 구체적으로 말하세요.',
    '상사에게 문제를 말할 때는 문제만 던지기보다 가능한 선택지 두 개를 같이 가져가는 편이 좋습니다. 상대는 결정을 내리기 쉬워집니다.',
    '동료와 이야기할 때는 “왜 안 했어요?”보다 “현재 어디까지 됐고, 제가 무엇을 도우면 될까요?”처럼 공동 해결 방식이 마찰을 줄입니다.'
  ],
  이직:[
    '이직은 운세보다 조건표가 먼저입니다. 연봉, 실제 역할, 상사, 근무시간, 출퇴근, 2년 뒤 경력가치를 적어 현재 회사와 비교하세요.',
    '새 회사가 좋아 보일수록 “무엇이 좋아지는가”뿐 아니라 “무엇을 포기하는가”도 적어보세요. 복지, 안정성, 팀 분위기, 퇴근시간 같은 항목이 빠지기 쉽습니다.',
    '이직 제안이 왔다면 바로 사표를 내기보다 오퍼레터와 입사조건을 먼저 확정하고 움직이는 것이 기본입니다.'
  ],
  승진:[
    '승진이나 연봉협상에서는 성실함보다 결과를 보여줘야 합니다. 지난 6~12개월 성과를 숫자와 사례 3개로 정리하세요.',
    '책임이 늘어나는 자리라면 직함만 보지 말고 실제 권한, 인력, 평가기준이 같이 따라오는지 확인해야 합니다.',
    '협상 전에 원하는 숫자 하나만 정하지 말고 최소수준, 목표수준, 대신 받을 수 있는 조건까지 세 단계로 준비하면 대화가 훨씬 수월합니다.'
  ],
  면접:[
    '면접은 좋은 날보다 준비된 사례가 중요합니다. 성공 사례만이 아니라 실패 후 수정한 경험까지 3개 정도 STAR 방식으로 준비하세요.',
    '답변을 길게 외우면 질문이 조금만 바뀌어도 흔들립니다. 핵심 경험, 숫자, 내가 한 행동 세 가지를 키워드로 기억하는 편이 낫습니다.',
    '면접 직전에는 새로운 내용을 더 넣기보다 회사와 직무를 왜 선택했는지 한 문장으로 정리하고 들어가는 것이 좋습니다.'
  ],
  시험:[
    '시험은 새로운 범위를 넓히는 것보다 틀리는 패턴을 줄이는 것이 점수에 더 직접적입니다. 기출을 풀고 오답 이유를 분류하세요.',
    '공부 시간이 짧다면 “많이 보기”보다 실제 시험처럼 시간을 재고 문제를 푸는 연습이 효율적입니다.',
    '시험 전날에는 공부량보다 수면과 준비물 관리가 중요합니다. 마지막 날에 무리해서 리듬을 깨는 건 피하세요.'
  ],
  계약:[
    '계약은 사주가 결론을 대신하면 안 됩니다. 금액, 기간, 해지조건, 위약금, 자동갱신, 책임범위를 문서에서 직접 확인하세요.',
    '구두로 들은 조건과 계약서 문구가 다르면 문서가 우선입니다. 중요한 약속은 반드시 계약서나 메시지에 남기세요.',
    '계약 상대가 “오늘 안 하면 안 된다”고 재촉할수록 오히려 한 번 더 확인해야 합니다. 서두르게 만드는 압박 자체가 위험 신호일 수 있습니다.'
  ],
  구매:[
    '큰 구매라면 가격만 보지 말고 유지비, 보험, 수리비, 환불·해지조건까지 1년 비용으로 계산하세요.',
    '사고 싶은 마음이 큰 날일수록 “없으면 정말 불편한가”와 “같은 목적의 더 싼 대안은 없는가”를 따로 적어보는 게 좋습니다.',
    '고가 물건은 당일 결제보다 하루 뒤 다시 봐도 마음이 같은지 확인하는 규칙을 두면 충동구매를 크게 줄일 수 있습니다.'
  ],
  투자:[
    '투자 수익은 사주로 예측할 수 없습니다. 매수 이유, 손실 한도, 투자기간, 포트폴리오 비중 같은 객관적 기준이 먼저입니다.',
    '오를 것 같다는 느낌보다 “내 판단이 틀렸다고 인정할 조건”을 미리 정하는 게 투자에서는 더 중요합니다.',
    '빚을 내거나 생활비를 넣는 결정은 명리 흐름과 무관하게 위험합니다. 감당 가능한 손실 범위 안에서만 판단하세요.'
  ],
  창업:[
    '창업은 좋은 날짜보다 고객이 실제로 돈을 내는지 확인하는 게 먼저입니다. 임대차나 대규모 지출 전 작은 판매 테스트를 해보세요.',
    '아이디어가 좋아 보여도 월 고정비와 손익분기 매출을 계산하지 않으면 버티기 어렵습니다. 최소 6개월 현금흐름을 먼저 봐야 합니다.',
    '동업이라면 친분보다 역할, 지분, 의사결정권, 탈퇴조건을 문서로 정하는 것이 훨씬 중요합니다.'
  ],
  가족:[
    '가족 대화는 오래된 감정이 섞이기 쉬워 한 번에 과거 전체를 꺼내면 해결이 어렵습니다. 이번에 해결할 주제 하나만 정하세요.',
    '부모나 자녀와 돈 이야기를 할 때는 누가 더 희생했는지보다 필요한 금액, 기간, 각자 가능한 범위를 숫자로 정리하는 게 좋습니다.',
    '가족에게 부탁할 일이 있다면 “당연히 해줄 거라 생각했다”는 전제를 버리고, 가능 여부를 묻는 방식으로 시작하세요.'
  ],
  이사:[
    '이사는 길일보다 잔금, 입주 가능시간, 엘리베이터 예약, 전입신고, 가스·인터넷 같은 현실 일정이 먼저입니다.',
    '날짜 후보가 여러 개라면 비용과 휴가 사용, 교통 혼잡까지 비교한 뒤 명리 기준을 마지막 동점 결정 요소로 쓰는 편이 합리적입니다.',
    '이사 전날까지 박스를 다 싸는 것보다 중요한 서류와 귀중품은 따로 들고 이동할 가방을 먼저 준비해두세요.'
  ],
  여행:[
    '여행은 운보다 교통, 날씨, 취소조건, 체력이 더 중요합니다. 특히 환승시간과 귀가시간을 넉넉하게 보세요.',
    '일정이 빡빡할수록 한 곳이 늦어지면 전체가 무너집니다. 핵심 일정 하나와 선택 일정 두 개 정도로 나누는 게 좋습니다.',
    '출장이라면 이동일에 중요한 발표나 계약을 연달아 잡지 않는 편이 실수를 줄입니다.'
  ],
  건강:[
    '건강 문제는 사주로 판단하지 않습니다. 증상, 검사결과, 의료진 권고가 우선입니다.',
    '수술이나 치료 날짜를 고민한다면 응급성, 담당의 권고, 병원 일정, 회복에 필요한 휴가를 먼저 확인하세요.',
    '사주는 생활 리듬을 돌아보는 참고 정도로만 쓰고, 통증이나 이상 증상이 있으면 실제 진료를 미루지 마세요.'
  ],
  약속:[
    '약속은 상대의 일정과 이동 부담을 먼저 보세요. “언제 돼?”보다 내가 가능한 두세 시간을 주는 편이 답하기 쉽습니다.',
    '첫 약속이라면 너무 늦은 시간이나 이동이 복잡한 장소보다 짧게 끝낼 수 있는 곳이 부담이 적습니다.',
    '중요한 만남이라면 약속 전날 한 번 확인 메시지를 보내는 것만으로도 엇갈림을 크게 줄일 수 있습니다.'
  ],
  중요대화:[
    '중요한 이야기는 한 번에 모든 결론을 내리려 하지 않는 것이 좋습니다. 핵심 사실과 내가 원하는 다음 단계만 먼저 꺼내세요.',
    '민감한 주제일수록 메시지로 길게 설명하기보다 서로 시간을 잡고 대화하는 편이 오해를 줄입니다.',
    '상대가 피곤하거나 급한 상황이면 좋은 내용도 잘 안 들립니다. 이야기 내용만큼 시간과 장소를 고르는 것이 중요합니다.'
  ],
  일반:[
    '이 질문은 사주가 대신 결정할 일은 아닙니다. 비용, 시간, 상대 반응처럼 확인 가능한 조건부터 보세요.',
    '되돌리기 쉬운 선택이면 작게 해보고 반응을 확인하고, 되돌리기 어려운 선택이면 한 번 더 비교하는 원칙이 좋습니다.',
    '결정을 미루는 게 문제라면 완벽한 확신을 기다리기보다 가장 작은 실행 단계를 정해보세요.'
  ]
};

const SCRIPTS={
  소개팅:['“이번 주 수요일이나 금요일 저녁 중 편한 날 있어요? 부담 없이 커피나 식사해요.”','“처음이니까 너무 길게 잡지 말고 한두 시간 편하게 이야기해요.”'],
  고백:['“나는 요즘 너를 친구 이상으로 생각하고 있어. 너는 우리 관계를 어떻게 느끼는지 궁금해.”','“답을 바로 달라는 건 아니고, 네 생각도 편하게 듣고 싶어.”'],
  연락:['“오랜만이야. 문득 생각나서 연락했어. 요즘 어떻게 지내?”','“전에 이야기했던 일이 생각났는데 잘 지내는지 궁금했어.”'],
  화해:['“어제 내가 한 말 때문에 기분 상했을 것 같아. 그 부분은 미안해.”','“내가 하고 싶었던 말과 실제로 전달된 말이 달랐던 것 같아. 다시 이야기하고 싶어.”'],
  직장대화:['“A·B·C 업무가 이번 주에 겹칩니다. A를 우선하면 B는 금요일까지 밀릴 수 있는데 우선순위를 정해주실까요?”','“제가 생각한 선택지는 두 가지입니다. 1안은 일정 유지, 2안은 범위를 줄이는 방식인데 어느 쪽이 더 중요한지 확인하고 싶습니다.”'],
  이직:['“새 회사 조건을 현재 회사와 항목별로 비교해본 뒤 결정하겠습니다.”'],
  승진:['“지난 1년 동안 맡은 역할과 성과를 정리해봤습니다. 다음 역할과 보상에 대해 이야기하고 싶습니다.”'],
  가족:['“이번에는 과거 이야기 전체보다 이번 문제 하나만 정리하고 싶어.”'],
  중요대화:['“지금 바로 결론을 내자는 건 아니고, 내가 중요하게 생각하는 부분을 먼저 이야기하고 싶어.”'],
  약속:['“이번 주 목요일 7시나 토요일 5시 중 편한 시간이 있어?”']
};

function profile12(){try{return JSON.parse(localStorage.getItem('todaygyeol.v2.profile')||'null')}catch{return null}}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function loadHistory(){try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')}catch{return []}}
function saveHistory(h){localStorage.setItem(HISTORY_KEY,JSON.stringify(h.slice(-40)))}
function nextCounter(){const n=(Number(localStorage.getItem(COUNTER_KEY)||0)+1)%100000;localStorage.setItem(COUNTER_KEY,String(n));return n}
function normalize(s){return String(s||'').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()}
function similarity(a,b){a=new Set(normalize(a).split(' ').filter(x=>x.length>1));b=new Set(normalize(b).split(' ').filter(x=>x.length>1));if(!a.size||!b.size)return 0;let n=0;a.forEach(x=>{if(b.has(x))n++});return n/Math.min(a.size,b.size)}
function choose(pool,key){if(!pool?.length)return '';const hist=loadHistory();const recent=hist.slice(-8).map(x=>x.text);const start=(hash(key)+nextCounter())%pool.length;for(let k=0;k<pool.length;k++){const v=pool[(start+k)%pool.length];if(!recent.some(r=>similarity(v,r)>.62)){hist.push({t:Date.now(),text:v});saveHistory(hist);return v}}const v=pool[start];hist.push({t:Date.now(),text:v});saveHistory(hist);return v}
function intentOf(q){const l=q.toLowerCase();for(const [id,ks] of INTENTS){if(ks.some(k=>l.includes(k)))return id}return '일반'}
function riskyIntent(i){return ['투자','건강'].includes(i)}
function purposeOf(i){if(['소개팅','데이트','고백','약속'].includes(i))return '소개팅·만남';if(['계약','구매','투자','창업'].includes(i))return '계약·거래';if(['이사','여행'].includes(i))return '이사·이동';if(['시험','면접'].includes(i))return '공부·시험 준비';return '중요한 대화'}
function currentCtx(){const p=profile12();if(!p||typeof solarFromProfile!=='function')return null;try{const ec=ecFromSolar(solarFromProfile(p),p),c=countElements(ec,p);const arr=Object.entries(c).sort((a,b)=>b[1]-a[1]), low=[...Object.entries(c)].sort((a,b)=>a[1]-b[1])[0]?.[0];return {p,ec,c,high:arr[0]?.[0],low,dm:DAYMASTER[ec.getDayGan()]||{}}}catch{return null}}
function dateISO(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function monday(d){const x=new Date(d);const day=x.getDay()||7;x.setDate(x.getDate()-day+1);x.setHours(0,0,0,0);return x}
function monthEnd(d){return new Date(d.getFullYear(),d.getMonth()+1,0)}
function parseRange(q){const now=new Date();now.setHours(0,0,0,0);let s=new Date(now),e=new Date(now),label='오늘';
 if(/내일/.test(q)){s=e=addDays(now,1);label='내일'}
 else if(/다음\s*주말/.test(q)){const m=addDays(monday(now),7);s=addDays(m,5);e=addDays(m,6);label='다음 주말'}
 else if(/이번\s*주말|주말/.test(q)){const m=monday(now);s=addDays(m,5);e=addDays(m,6);if(e<now){s=addDays(m,12);e=addDays(m,13)}else if(s<now)s=new Date(now);label='이번 주말'}
 else if(/다음\s*주/.test(q)){s=addDays(monday(now),7);e=addDays(s,6);label='다음 주'}
 else if(/이번\s*주|이번주/.test(q)){e=addDays(monday(now),6);label='이번 주'}
 else if(/다음\s*달/.test(q)){s=new Date(now.getFullYear(),now.getMonth()+1,1);e=monthEnd(s);label='다음 달'}
 else if(/이번\s*달|이번달/.test(q)){e=monthEnd(now);label='이번 달'}
 return {s,e,label};
}
function asksWhen(q){return /언제|몇\s*시|시간|이번\s*주|이번주|다음\s*주|주말|이번\s*달|다음\s*달|날짜|요일/.test(q)}
function timeWindows(intent){if(['소개팅','데이트','고백','약속'].includes(intent))return [[13,15],[15,17],[17,19],[19,21]];if(['직장대화','승진','면접','계약'].includes(intent))return [[9,11],[11,13],[13,15],[15,17]];if(['시험'].includes(intent))return [[7,9],[9,11],[13,15],[15,17]];if(['이사','여행'].includes(intent))return [[7,9],[9,11],[11,13],[13,15]];return [[9,11],[11,13],[15,17],[17,19],[19,21]]}
function timeInfo(ds,h,p,intent){try{const {y,m,d}=ymd(ds);const s=Solar.fromYmdHms(y,m,d,h,0,0),l=s.getLunar(),ec=l.getEightChar();try{ec.setSect(Number(p.sect||2))}catch{}const natal=ecFromSolar(solarFromProfile(p),p);const a=interaction(natal.getDayZhi(),ec.getTimeZhi()),b=interaction(ec.getDayZhi(),ec.getTimeZhi()),r=relation(natal.getDayGan(),ec.getTimeGan());let score=70+(a.type==='합'?8:a.type==='충'?-10:0)+(b.type==='합'?4:b.type==='충'?-5:0)+({지원:5,표현:4,동질:2,관리:1,압박:-5}[r]||0);const yi=safeCall(l,'getTimeYi')||[],ji=safeCall(l,'getTimeJi')||[];const keys=PURPOSE_KEYS[purposeOf(intent)]||[];keys.forEach(k=>{if(yi.includes(k))score+=3;if(ji.includes(k))score-=4});return {h,a,b,r,yi,ji,score}}catch{return {h,a:{type:'평'},b:{type:'평'},r:'중립',yi:[],ji:[],score:60}}}
function rankDates(q,intent){const p=profile12(),range=parseRange(q),rows=[];for(let d=new Date(range.s);d<=range.e;d=addDays(d,1)){const ds=dateISO(d);try{const inf=dayInfo(ds,p);let sc=purposeScore(inf,purposeOf(intent));const tw=timeWindows(intent).map(([a,b])=>({...timeInfo(ds,a,p,intent),a,b})).sort((x,y)=>y.score-x.score)[0];sc+=Math.round((tw.score-65)*.35);rows.push({ds,d:new Date(d),inf,tw,score:sc})}catch{}}
 rows.sort((a,b)=>b.score-a.score);return {range,rows:rows.slice(0,3),all:rows}}
function weekday(d){return `${d.getMonth()+1}월 ${d.getDate()}일 ${WEEK[d.getDay()]}요일`}
function formatHour(a,b){return `${String(a).padStart(2,'0')}:00~${String(b).padStart(2,'0')}:00`}
function dateReason(row,intent){const p=[];if(row.inf.inter.type==='합')p.push('내 일지와 그날 일지가 합 관계라 사람이나 일이 연결되는 신호를 우선 반영했습니다');else if(row.inf.inter.type==='충')p.push('내 일지와 그날 일지가 충 관계라 1순위로 두지는 않았지만 다른 조건을 함께 비교했습니다');else p.push('내 일지와 그날 일지 사이에 큰 충이 없어 기본 흐름이 비교적 안정적입니다');
 if(row.inf.rel==='지원')p.push('그날 천간은 내 일간을 돕는 지원 관계입니다');else if(row.inf.rel==='표현')p.push('그날 천간은 표현·행동을 밖으로 꺼내는 관계입니다');else if(row.inf.rel==='관리')p.push('그날 천간은 약속·조건·현실 정리를 강조하는 관계입니다');
 const good=translateActs(row.inf.yi||[],3);if(good.length)p.push(`전통력의 좋은 활동에는 ${good.join('·')}가 포함됩니다`);return p.slice(0,3).join('. ')+'.'}
function timeReason(row){const p=[];if(row.tw.a.type==='합')p.push('이 시간의 시지가 내 일지와 합 관계입니다');else if(row.tw.a.type==='충')p.push('이 시간의 시지가 내 일지와 충이라 원래는 감점 요소지만 다른 시간 조건과 비교해 순위를 정했습니다');else p.push('이 시간의 시지는 내 일지와 큰 충이 없습니다');if(row.tw.b.type==='합')p.push('그날 일지와 시간 지지도 합으로 이어집니다');else if(row.tw.b.type==='충')p.push('그날 일지와 시간 지지에 충이 있어 너무 서두르지 않는 편이 좋습니다');if(row.tw.r==='지원')p.push('시간 천간은 내 일간을 돕는 관계입니다');else if(row.tw.r==='표현')p.push('시간 천간은 말과 행동을 꺼내는 관계입니다');return p.slice(0,3).join('. ')+'.'}
function scheduleHtml(q,intent){const r=rankDates(q,intent);if(!r.rows.length)return '<p>날짜 계산을 하지 못했습니다. 만세력 엔진 연결을 확인해주세요.</p>';const [best,...rest]=r.rows;const caution=[...r.all].sort((a,b)=>a.score-b.score)[0];const cards=r.rows.map((x,idx)=>`<article class="v12-date ${idx===0?'best':''}"><small>${idx+1}순위</small><h3>${weekday(x.d)} · ${formatHour(x.tw.a,x.tw.b)}</h3><p><b>이 날을 고른 이유</b><br>${dateReason(x,intent)}</p><p><b>이 시간을 고른 이유</b><br>${timeReason(x)}</p></article>`).join('');return `<div class="v12-schedule"><div class="v12-verdict"><span>${r.range.label} 택일</span><h2>제가 하나만 고른다면<br>${weekday(best.d)} ${formatHour(best.tw.a,best.tw.b)}예요.</h2><p>날짜와 시간을 따로 계산한 뒤 현실적으로 ${intent==='소개팅'?'첫 만남에 쓰기 편한 시간대':intent==='직장대화'?'업무 대화를 하기 가능한 시간대':'실제로 움직이기 가능한 시간대'}까지 겹쳐서 골랐습니다.</p></div>${cards}${caution&&caution.ds!==best.ds?`<div class="v12-caution"><b>상대적으로 덜 추천하는 후보</b><p>${weekday(caution.d)} ${formatHour(caution.tw.a,caution.tw.b)}는 다른 후보보다 합·충과 시간 관계에서 부담 신호가 더 있어 뒤로 뒀습니다. 꼭 그날이어야 한다면 중요한 결론을 서두르기보다 일정 자체를 편하게 잡으세요.</p></div>`:''}<details><summary>계산 근거 자세히 보기</summary><p class="small">후보 날짜마다 내 일주와 일진의 합·충, 일간 관계, 목적별 전통력 宜/忌를 비교하고, 시간은 시주·내 일지↔시지·당일 일지↔시지·시간 천간 관계를 따로 비교했습니다. 내부 점수는 성공확률이 아니라 후보 정렬용입니다.</p></details></div>`}

function personalAngle(ctx,intent,di){if(!ctx)return '';const dm=ctx.dm?.name||ganzhiKo(ctx.ec.getDayGan());const high=ctx.high,low=ctx.low;const variants=[
 `${dm}을 중심으로 보면 평소 ${high} 기운의 방식을 익숙하게 쓰고 ${low} 기운은 덜 쓰는 편입니다. 그래서 이번 선택에서도 익숙한 방식만 밀기보다 ${low} 기운처럼 다른 접근을 조금 섞는 것이 균형에 도움이 됩니다.`,
 `원국에서는 ${high} 기운이 강하고 ${low} 기운이 상대적으로 약하게 보입니다. 이런 구조는 “내가 늘 하던 방식”이 분명하다는 뜻으로 읽을 수 있어서, ${intent==='고백'||intent==='화해'?'관계에서는 추측보다 직접 확인하는 방식':'결정에서는 한 번 더 다른 관점을 비교하는 방식'}이 특히 중요합니다.`,
 `당신의 일간은 ${dm}입니다. 전통적으로 이 일간은 ${ctx.dm?.summary||'자기 방식으로 상황을 읽는 성향'}으로 풀이합니다. 오늘은 이 타고난 성향에 ${di.rel} 관계가 겹치기 때문에, 평소보다 ${di.rel==='표현'?'말과 행동을 밖으로 꺼내는 것':di.rel==='지원'?'도움을 받거나 정보를 더 확인하는 것':di.rel==='관리'?'조건을 정리하는 것':di.rel==='압박'?'속도를 줄이고 부담을 점검하는 것':'기본 리듬을 지키는 것'}이 핵심입니다.`
];return choose(variants,ctx.ec.getDay()+intent+'personal')}
function myeongriPara(ctx,di,intent){const inter=di.inter.type,rel=di.rel;const a=inter==='합'?`오늘은 내 일지와 일진이 합 관계입니다. 합은 무조건 “좋다”가 아니라 사람이나 일이 서로 묶이고 연결되는 힘으로 봅니다. 그래서 ${['소개팅','데이트','고백','연락','약속','화해'].includes(intent)?'관계를 이어보는 행동':'협의나 연결을 만드는 행동'}에는 쓸 수 있지만, 한 번에 결론까지 확정하라는 뜻은 아닙니다.`:inter==='충'?`오늘은 내 일지와 일진에 충이 있습니다. 충은 실패 신호라기보다 움직임과 변화가 커지는 쪽으로 읽습니다. 일정이 바뀌거나 감정이 빨리 올라올 수 있으니, 되돌리기 어려운 결정을 서두르지 않는 편이 좋습니다.`:`오늘은 내 일지와 일진 사이에 큰 합·충이 없습니다. 이런 날은 특별한 길흉보다 준비 상태와 상대의 반응이 결과에 더 크게 작용한다고 보는 편이 맞습니다.`;
 const b=rel==='표현'?'천간 관계는 표현 쪽이라 말하거나 보여주거나 실행하는 행동이 비교적 자연스럽습니다.':rel==='지원'?'천간 관계는 지원 쪽이라 혼자 밀어붙이기보다 정보·조언·도움을 받는 방식이 잘 맞습니다.':rel==='관리'?'천간 관계는 관리 쪽이라 약속, 조건, 돈, 일정처럼 현실적인 요소를 정리하는 일이 중요합니다.':rel==='압박'?'천간 관계는 압박 쪽이라 책임감이 커지거나 마음이 급해질 수 있습니다. 그래서 “해야 한다”는 생각과 “지금 하는 게 맞다”는 판단을 구분하세요.':'천간 관계는 한쪽으로 강하게 치우치지 않아 평소 방식과 현실 조건을 우선하면 됩니다.';return `${a} ${b}`}
function actionPara(intent,q,di){const pools={
 소개팅:['제가 권한다면 약속부터 크게 만들지 않겠습니다. 가능한 날짜 두 개를 제안하고 상대가 편한 쪽을 고르게 하세요. 첫 만남은 카페나 식사 한 곳 정도로 끝낼 수 있게 잡는 편이 좋습니다.','소개팅이라면 “이번 주 수·금 저녁 중 편한 날 있어요?”처럼 선택지를 주세요. 날짜를 정한 뒤에는 장소를 너무 멀리 잡지 말고, 대화가 잘 들리는 곳을 고르는 게 더 중요합니다.'],
 고백:['고백을 한다면 감정의 크기를 증명하려 하기보다 관계를 어떻게 느끼는지 묻는 방식이 좋습니다. 상대가 생각할 시간을 가져도 괜찮다는 여지를 주세요.','오늘 마음을 전한다면 “사귀자”라는 결론부터 요구하지 말고, 내가 느끼는 마음과 상대의 생각을 나누는 대화로 시작하세요.'],
 화해:['오늘 화해한다면 과거 전체를 끌어오지 마세요. 최근 사건 하나만 말하고, 내가 아쉬웠던 점과 앞으로 바라는 행동 하나를 정리하세요.','먼저 사과할 부분이 있다면 조건 없이 인정하고, 해명은 상대가 들을 준비가 된 뒤에 하세요.'],
 직장대화:['말하기 전에 메모 세 줄을 준비하세요. 현재 상황, 문제가 되는 부분, 원하는 결정입니다. 이 세 가지가 있으면 감정적인 하소연으로 흐르지 않습니다.','상사에게는 문제와 함께 선택지 두 개를 가져가세요. “어떻게 할까요?”만 묻는 것보다 판단하기 쉬운 대화가 됩니다.'],
 이직:['오늘은 조건표를 만드는 날로 쓰세요. 새 회사와 현재 회사를 같은 항목으로 비교하고, 최종 결정은 오퍼가 문서로 확정된 뒤 하세요.'],
 계약:['오늘 계약을 검토한다면 “좋은 날인가”보다 계약서에서 돈이 나가는 조건과 끝내는 조건을 먼저 찾으세요. 위약금, 자동갱신, 해지기한은 별표를 쳐도 좋습니다.'],
 면접:['오늘 준비한다면 예상질문 20개를 외우기보다 내 경험 3개를 숫자와 행동으로 정리하세요. 어떤 질문이 와도 그 사례를 변형해 답할 수 있습니다.'],
 약속:['약속을 잡는다면 내가 가능한 시간 두 개를 먼저 제안하세요. 상대가 고르게 하면 대화가 빨리 정리되고 부담도 줄어듭니다.'],
 중요대화:['중요한 이야기는 결론 하나, 근거 두 개, 상대에게 묻고 싶은 것 하나만 준비하세요. 길게 설명할수록 핵심이 흐려질 수 있습니다.']};return choose(pools[intent]||['오늘은 되돌리기 쉬운 작은 행동부터 해보세요. 현실 반응을 확인한 뒤 다음 단계를 정하면 됩니다.'],intent+q+di.inter.type+di.rel)}
function scriptHtml(intent,q){const arr=SCRIPTS[intent];if(!arr?.length)return '';const s=choose(arr,intent+q+'script');return `<div class="v12-script"><b>말을 꺼낸다면 이렇게</b><p>${s}</p></div>`}
function deepAnswer(q,intent){const p=profile12(),ctx=currentCtx();const di=dayInfo(todayYmd(),p);const intro=choose(LEADS,intent+q+'lead');const reality=choose(REALITY[intent]||REALITY.일반,intent+q+'real');const trans=choose(TRANSITIONS,intent+q+'trans');const personal=personalAngle(ctx,intent,di);const m=myeongriPara(ctx,di,intent);const act=actionPara(intent,q,di);const ending=choose(ENDINGS,intent+q+'end');const title=riskyIntent(intent)?'현실 판단을 먼저 하세요':di.inter.type==='합'?'움직여볼 만합니다':di.inter.type==='충'?'가능하지만 속도를 낮추세요':'무난하게 진행할 수 있어요';return `<div class="v12-consult"><span class="badge">${intent} 상담</span><div class="label" style="margin-top:12px">오늘의 결론</div><div class="big-choice">${title}</div><p class="v12-opening">${intro}</p><div class="v12-talk"><b>제가 먼저 현실 쪽에서 말씀드리면</b><p>${reality}</p></div><div class="v12-talk"><b>${trans}</b><p>${personal}</p><p>${m}</p></div><div class="v12-talk"><b>그래서 오늘 제가 권하는 방식은</b><p>${act}</p></div>${scriptHtml(intent,q)}<div class="v12-summary"><b>마지막으로 한마디만 정리하면</b><p>${ending}</p></div><details><summary>전문 근거 보기</summary><p class="small">오늘 일진 ${ganzhiKo(di.ec.getDay())} · 내 일지와 ${di.inter.type} · 일간 관계 ${di.rel}<br>원국 일간 ${ctx?ganzhiKo(ctx.ec.getDayGan()):'-'} · 강한 오행 ${ctx?.high||'-'} · 상대적으로 적은 오행 ${ctx?.low||'-'}</p><p class="small muted">합·충과 오행 관계는 전통 명리의 해석 자료이며 성공·실패 확률이 아닙니다.</p></details></div>`}
function answer12(){const p=profile12();if(!p)return alert('내 사주를 먼저 등록하세요.');const q=$q('#askText')?.value.trim();if(!q)return alert('질문을 입력하세요.');const out=$q('#askResult');try{const intent=intentOf(q);out.hidden=false;out.innerHTML=asksWhen(q)?scheduleHtml(q,intent):deepAnswer(q,intent);out.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){out.hidden=false;out.innerHTML=`<p>${e.message||'상담 계산 중 오류가 발생했습니다.'}</p>`}}
function addUI(){const card=$q('#ask .card');if(card&&!$q('#v12-note')){const d=document.createElement('div');d.id='v12-note';d.className='v12-note';d.innerHTML='<b>12.0 상담엔진</b><span>같은 문장 반복을 줄이고, 질문 맥락·원국·오늘 일진을 함께 봅니다. “이번 주 언제?”라고 물으면 날짜와 시간까지 고릅니다.</span>';card.insertBefore(d,card.querySelector('textarea'))}const btn=$q('#askBtn');if(btn){btn.onclick=answer12;btn.textContent='사주 선생님처럼 풀어보기'}const more=$q('#more .stack.small');if(more){const first=more.querySelector('div');if(first)first.innerHTML='<b>버전</b> 12.0 · 생각해서 말하는 상담엔진'}document.title='오늘결 12.0 · 생각해서 말하는 사주상담'}
function init(){addUI();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
window.answer12=answer12;
})();
