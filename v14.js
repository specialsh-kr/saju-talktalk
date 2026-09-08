// 사주톡톡 14.0 · 간결 실전상담 엔진
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const STORE='todaygyeol.v2.profile';
const HIST='sajutalk.v14.history';
const WEEK=['일','월','화','수','목','금','토'];
function profile(){try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch{return null}}
function history(){try{return JSON.parse(localStorage.getItem(HIST)||'[]')}catch{return[]}}
function pushHistory(s){const h=history();h.push(String(s));localStorage.setItem(HIST,JSON.stringify(h.slice(-60)))}
function clean(s){return String(s||'').replace(/[\s\p{P}\p{S}]/gu,'').replace(/오늘|이번|정말|조금|먼저|중요|좋아요|좋습니다/g,'')}
function similarity(a,b){a=clean(a);b=clean(b);if(!a||!b)return 0;const A=new Set([...a]),B=new Set([...b]);let n=0;A.forEach(x=>B.has(x)&&n++);return n/Math.max(A.size,B.size)}
function vary(arr,key=''){if(!arr?.length)return'';let seed=2166136261;for(const ch of key)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;const h=history().slice(-18);for(let k=0;k<arr.length;k++){const x=arr[(seed+k)%arr.length];if(!h.some(p=>similarity(p,x)>.7)){pushHistory(x);return x}}return arr[seed%arr.length]}
function context(){try{const p=profile();if(!p)return null;const ec=ecFromSolar(solarFromProfile(p),p),cnt=countElements(ec),ord=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);return{p,ec,dm:DAYMASTER?.[ec.getDayGan()]||{},gan:ec.getDayGan(),zhi:ec.getDayZhi(),high:ord[0]?.[0]||'',low:ord.at(-1)?.[0]||''}}catch{return null}}
function todayInfo(){try{return dayInfo(todayYmd(),profile())}catch{return null}}
const RULES=[
 ['간식·호의',/간식|과자|커피|음료|밥\s*사|선물|챙겨|사주고/],['소개팅',/소개팅|첫\s*만남|소개\s*받/],['데이트',/데이트|둘이\s*만나|연인과\s*만나/],['고백',/고백|사귀자|좋아한다고|마음\s*(전|말)/],['재회',/재회|전남친|전여친|다시\s*만나|헤어진/],['연락',/연락|카톡|문자|전화|DM|디엠/],['화해',/화해|사과|미안|서운|싸웠|갈등/],
 ['이직',/이직|퇴사|사표|직장\s*옮|회사\s*옮/],['승진·연봉',/승진|연봉|협상|고과|평가/],['면접·취업',/면접|지원서|입사지원|취업/],['직장대화',/팀장|상사|부장|과장|업무|보고|회의|프로젝트|담당/],
 ['계약',/계약|서명|거래|매매|임대차|전세계약|월세계약/],['투자',/주식|코인|투자|매수|매도|ETF|펀드/],['큰구매',/차\s*(살|사)|집\s*(살|사)|구매|살까|사도\s*될/],['창업',/창업|사업|가게|동업/],
 ['시험·공부',/시험|공부|자격증|수능|공시/],['가족',/부모|엄마|아빠|가족|자녀|아이|형제|자매/],['이사',/이사|입주|전입/],['여행',/여행|출장|출발|비행/],['건강',/병원|수술|치료|검사|약|건강|통증|아프/],['중요대화',/중요한\s*(말|이야기|얘기)|말\s*꺼|대화|설득|부탁|고민\s*말/],['약속',/약속|만날까|만남|시간\s*잡/]
];
function intent(q){for(const [n,r] of RULES)if(r.test(q))return n;return'일반'}
function asksWhen(q){return /언제|몇\s*시|시간대|이번\s*주|다음\s*주|주말|이번\s*달|다음\s*달|날짜|요일/.test(q)}
function daySignal(di){if(!di)return'큰 충돌 신호는 잡히지 않습니다.';if(di.inter?.type==='합')return'오늘은 내 일지와 일진이 합으로 이어집니다. 사람이나 일이 붙는 힘을 쓰기 좋은 쪽입니다.';if(di.inter?.type==='충')return'오늘은 내 일지와 일진이 충입니다. 가만히 있기보다 변화가 생기기 쉬우니, 말과 결정을 한 박자 나눠 가는 편이 낫습니다.';return'오늘은 내 일지와 일진의 큰 합·충이 없습니다. 이런 날은 운보다 준비와 상대 반응이 더 크게 작용합니다.'}
function relSignal(r){return({지원:'오늘 천간은 도움을 받거나 정보를 얻는 쪽에 힘이 실립니다.',표현:'오늘 천간은 말하고 제안하고 움직이는 쪽에 힘이 실립니다.',관리:'오늘 천간은 돈·조건·약속을 정리하는 데 힘이 실립니다.',압박:'오늘 천간은 책임과 조급함이 커지기 쉬워 결론을 서두르지 않는 편이 좋습니다.',동질:'오늘 천간은 내 방식대로 밀기 쉬운 날입니다. 상대 속도만 놓치지 마세요.'}[r]||'오늘 천간은 한쪽으로 강하게 치우치지 않습니다.')}
const CASES={
 '간식·호의':{verdict:['하세요. 다만 작게 하세요.','가볍게 건네는 건 좋습니다.'],body:['과자라면 “이거 같이 드실래요?” 하고 공동 간식처럼 꺼내세요. 선물처럼 포장하면 관계가 아직 가벼울 때는 부담이 생길 수 있습니다.','커피라면 취향부터 물으세요. “커피 드세요, 아니면 다른 거 드실래요?” 정도면 충분합니다.'],case:['상대가 화면을 계속 보고 있으면 간식만 두고 나오고, 상대가 먼저 말을 이어오면 그때 5~10분 정도 대화하세요.','오후 업무가 잠깐 끊기는 순간에 “저 잠깐 먹으려고 하는데 같이 드실래요?”라고 말하면 가장 자연스럽습니다.']},
 '소개팅':{verdict:['잡아도 됩니다. 첫 만남은 짧게 가세요.','만나는 쪽이 낫습니다. 다만 하루 종일 코스는 필요 없습니다.'],body:['첫 만남은 카페나 식사 한 곳, 1~2시간이면 충분합니다. 상대가 편하면 다음 약속이 자연스럽게 생깁니다.','“언제 돼요?”보다 “목요일 저녁이나 토요일 오후 중 편한 쪽 있어요?”처럼 두 선택지를 주세요. 답하기가 훨씬 쉽습니다.'],case:['상대가 야근 많은 직종이면 평일 늦은 저녁보다 주말 오후가 현실적으로 낫습니다. 명리상 1순위라도 상대가 지친 시간은 빼세요.','첫 만남에서 영화처럼 대화가 끊기는 일정보다 식사 후 산책 정도가 관계를 읽기 좋습니다.']},
 '데이트':{verdict:['만나세요. 일정은 빽빽하게 잡지 마세요.','둘이 편하게 이야기할 시간이 있는 일정이 좋습니다.'],body:['두세 곳을 도는 코스보다 식사 한 곳과 산책 정도가 낫습니다. 특히 최근 서로 바빴다면 더 그렇습니다.','좋은 데이트는 이벤트 수가 아니라 둘의 속도가 맞는지 보는 자리입니다. 쉬는 시간을 남겨두세요.'],case:['상대가 이번 주 야근이 많았다면 오전부터 하루 종일 보기보다 오후 늦게 만나 저녁까지 보내는 편이 낫습니다.','최근 다퉜다면 화해를 시험하는 거창한 데이트보다 짧은 식사로 분위기부터 풀어보세요.']},
 '고백':{verdict:['말해도 됩니다. 답을 재촉하지 마세요.','마음은 꺼내되 관계의 결론까지 한 번에 요구하지 마세요.'],body:['“나는 요즘 너를 친구 이상으로 생각해. 너는 우리를 어떻게 느껴?” 정도면 충분합니다. 긴 설명은 오히려 상대가 답하기 어렵습니다.','둘이 따로 만나는 게 자연스럽고 상대도 먼저 연락하거나 시간을 내는지 확인하세요. 날짜보다 이 신호가 먼저입니다.'],case:['헤어지기 직전 갑자기 장문 고백을 쏟기보다, 대화가 충분히 된 뒤 조용한 순간에 두 문장으로 말하세요.','최근 답장이 짧고 약속을 계속 미룬다면 고백으로 뒤집으려 하지 말고 관계 온도부터 확인하세요.']},
 '연락':{verdict:['짧게 한 번 보내세요.','연락은 해도 됩니다. 한 번 보내고 기다리세요.'],body:['안부 한 문장에 질문 하나면 됩니다. 같은 날 답이 없다고 추가 메시지를 여러 번 보내지 마세요.','오랜만이면 연락한 이유를 한 줄 넣으세요. “지난번 네가 말한 ○○ 생각나서. 요즘 어때?” 정도가 덜 뜬금없습니다.'],case:['교대근무나 야근이 많은 사람은 명리상 좋은 시간보다 실제 생활패턴이 우선입니다.','답장이 늦어도 내용이 길고 질문이 돌아오면 관계 온도는 나쁘지 않습니다. 속도만 보고 판단하지 마세요.']},
 '화해':{verdict:['풀어도 됩니다. 단, 한 사건만 이야기하세요.','오늘 말은 꺼내되 과거 일을 전부 가져오지는 마세요.'],body:['사실 → 내 감정 → 다음에 바라는 행동 순서로 말하세요. “어제 약속이 바뀌었는데 연락이 늦어서 서운했어. 다음엔 먼저 알려줘.”면 충분합니다.','사과할 때 “그럴 의도는 아니었어”부터 붙이지 마세요. 먼저 상처가 된 부분을 인정하고 해명은 나중입니다.'],case:['둘 중 한 사람이 아직 목소리가 커질 만큼 화가 났다면 오늘은 결론보다 다음 대화 시간을 정하는 데까지만 가세요.','메신저 장문보다 얼굴을 보고 10~20분 이야기하는 편이 오해를 줄이기 쉽습니다.']},
 '직장대화':{verdict:['말하세요. 대신 자료 세 줄을 들고 가세요.','상사에게 이야기할 수 있습니다. “힘들다”보다 “무엇을 결정해 달라”가 보여야 합니다.'],body:['메모는 세 줄이면 됩니다. 현재 상황, 문제가 되는 부분, 원하는 결정. 이 순서로 말하면 상대가 바로 판단할 수 있습니다.','업무량 문제라면 “A와 B 마감이 겹칩니다. A를 먼저 하면 B가 금요일까지 늦어집니다. 어느 쪽을 우선할까요?”처럼 말하세요.'],case:['평가 이야기라면 “열심히 했다”보다 매출, 시간 단축, 오류 감소처럼 숫자로 남은 결과 2~3개를 가져가세요.','불만만 꺼내면 방어가 생깁니다. 해결 가능한 선택지를 하나 같이 가져가면 대화가 달라집니다.']},
 '이직':{verdict:['옮길 수는 있습니다. 퇴사부터 하지 마세요.','이직운보다 오퍼 조건표가 먼저입니다.'],body:['연봉, 실제 역할, 상사, 근무시간, 출퇴근, 2년 뒤 경력가치를 현재 회사와 같은 표에 놓고 비교하세요.','오퍼레터가 확정되기 전 사표부터 내는 건 피하세요. 운이 좋아도 문서가 없으면 아직 결정할 단계가 아닙니다.'],case:['연봉이 10% 올라도 하루 출퇴근이 2시간 늘고 직무가 경력에 남지 않으면 체감 조건은 나빠질 수 있습니다.','연봉 차이가 작아도 책임 범위와 성장성이 커진다면 장기적으로는 더 좋은 이동이 될 수 있습니다.']},
 '승진·연봉':{verdict:['말할 때입니다. 숫자 3개를 준비하세요.','협상은 가능합니다. 근거 없는 자신감보다 성과 자료가 필요합니다.'],body:['최근 6~12개월에서 비용을 줄인 일, 시간을 줄인 일, 책임이 커진 일 가운데 세 가지를 숫자로 정리하세요.','원하는 조건도 최소, 목표, 대안 세 단계로 준비하세요. 그래야 대화가 막혀도 다음 수가 있습니다.'],case:['“매출을 올렸습니다”보다 “재구매율을 18%에서 25%로 올렸습니다”처럼 결과가 보이는 표현이 훨씬 강합니다.','직함만 올라가고 권한과 보상은 그대로인데 책임만 늘어난다면 승진 자체가 좋은 조건인지 다시 봐야 합니다.']},
 '면접·취업':{verdict:['지원하세요. 사례 세 개를 준비하세요.','좋은 날보다 답할 사례가 준비됐는지가 더 중요합니다.'],body:['성공 사례 2개와 실패 후 고친 사례 1개를 준비하세요. 상황, 행동, 결과 순서로 40초 안에 말할 수 있게 정리하면 됩니다.','“협업을 잘합니다”라고 말하지 말고 협업으로 실제 무엇을 해결했는지 이야기하세요.'],case:['“개발과 영업 일정이 충돌했을 때 우선순위 표를 만들어 지연을 2주에서 3일로 줄였다”처럼 말하면 바로 그림이 보입니다.','경력 전환 면접이면 왜 바꾸는지만 말하지 말고 기존 경험 중 새 직무에 그대로 가져갈 수 있는 능력을 연결하세요.']},
 '계약':{verdict:['날은 참고만 하세요. 계약서는 실제로 읽어야 합니다.','서명은 조건 확인이 끝났을 때만 하세요.'],body:['금액, 기간, 해지, 위약금, 자동갱신, 책임범위를 먼저 보세요. 사주가 좋아도 불리한 조항은 불리합니다.','구두로 합의한 내용은 계약서에 없으면 없는 것으로 생각하는 편이 안전합니다.'],case:['렌탈이나 헬스장 계약이면 월요금보다 중도해지 수수료와 자동연장 여부를 먼저 확인하세요.','사업 계약이면 지급일, 검수 기준, 수정 횟수, 지연 책임을 문장으로 남기세요.']},
 '투자':{verdict:['사주로 매수·매도하지 마세요.','운보다 손실 한도와 근거를 보세요.'],body:['왜 사는지, 얼마까지 잃을 수 있는지, 언제 판단이 틀렸다고 인정할지 세 가지가 없으면 아직 투자 결정이 아닙니다.','좋은 운이라는 이유로 비중을 늘리지 마세요. 자산배분과 현금흐름이 먼저입니다.'],case:['주가가 급등한 날 뒤늦게 따라가는 상황이라면 명리보다 가격과 리스크를 먼저 보세요.','생활비나 비상금까지 투자해야 하는 구조라면 운세와 무관하게 규모를 줄이는 게 맞습니다.']},
 '큰구매':{verdict:['사도 되는지는 1년 총비용으로 보세요.','오늘 기분보다 유지비가 답을 줍니다.'],body:['차라면 할부, 보험, 세금, 주차, 유지비까지 합치고 집이라면 대출이자, 관리비, 세금, 수리비까지 보세요.','“살 수 있다”와 “사도 된다”는 다른 말입니다. 사고 나서 생활비가 흔들리지 않는지가 기준입니다.'],case:['차값이 예산 안이어도 매달 60만~80만원의 유지비가 추가되면 실제 부담은 달라집니다.','집은 월 상환액만 보지 말고 금리가 1~2%p 올라도 버틸 수 있는지 계산하세요.']},
 '창업':{verdict:['계약보다 작은 판매 테스트부터 하세요.','사업운보다 고객이 돈을 내는지 먼저 확인하세요.'],body:['가게를 얻기 전에 실제 고객 10명에게 유료로 팔아보세요. 반응이 없으면 인테리어보다 상품을 먼저 고쳐야 합니다.','동업이라면 지분, 역할, 급여, 추가자금, 그만둘 때 정산 방식을 문서로 정하세요.'],case:['카페라면 상권이 좋아 보여도 하루 필요한 손님 수를 계산해보세요. 객단가 8천원에 월 고정비가 1천만원이면 필요한 매출이 바로 보입니다.','온라인 사업이면 광고비를 소액으로 써서 문의와 구매전환을 먼저 확인한 뒤 규모를 키우세요.']},
 '시험·공부':{verdict:['새 범위를 넓히기보다 약점을 줄이세요.','오늘은 오답과 시간관리에 힘을 쓰는 편이 낫습니다.'],body:['공부시간보다 틀린 이유를 분류하세요. 몰라서 틀린 문제, 헷갈린 문제, 시간 부족 문제를 나누면 다음 행동이 보입니다.','시험이 가까우면 새 교재보다 이미 본 자료를 다시 보는 편이 효율적입니다.'],case:['2시간 공부한다면 60분 문제풀이, 40분 오답, 20분 암기 확인처럼 목적을 나누세요.','모의고사 점수가 흔들리면 총점보다 과목별 시간 사용부터 확인하세요.']},
 '가족':{verdict:['한 번에 한 문제만 꺼내세요.','가족일수록 추측보다 구체적으로 말해야 합니다.'],body:['“왜 맨날 그래?” 대신 이번에 있었던 사건 하나를 말하고, 다음에 바라는 행동을 한 문장으로 말하세요.','돈 문제라면 감정이 아니라 금액, 날짜, 분담 기준을 적어놓고 이야기하세요.'],case:['부모와 생활비를 상의한다면 “도와줘”보다 월 얼마가 필요한지, 몇 달 동안 필요한지 말하는 편이 낫습니다.','자녀 문제라면 성격을 평가하지 말고 숙제, 귀가시간, 휴대폰처럼 바꿀 수 있는 행동을 이야기하세요.']},
 '이사':{verdict:['날짜는 고를 수 있습니다. 현실 일정이 비슷한 후보끼리 비교하세요.','명리상 좋은 날보다 잔금과 실제 입주가 가능한 날이 먼저입니다.'],body:['엘리베이터 예약, 관리사무소, 잔금, 인터넷 설치, 이사업체 시간이 맞는 후보를 먼저 남기고 그중에서 택일하세요.','출생지·시간 경계가 애매하면 시주까지 확정적인 것처럼 말하지 않는 게 맞습니다.'],case:['토요일 길일이라도 이사업체 비용이 두 배이고 엘리베이터 예약이 안 되면 평일 2순위가 실제로는 더 좋습니다.','오전 입주라면 잔금 송금과 열쇠 인수 시간을 먼저 확정하세요.']},
 '여행':{verdict:['가도 됩니다. 동선에 여유를 두세요.','좋은 날보다 지연을 흡수할 시간이 있는 일정이 좋습니다.'],body:['공항이나 역 도착시간을 너무 딱 맞추지 말고 30~60분의 여유를 남기세요.','첫날 일정은 하나 줄이는 편이 좋습니다. 이동이 길면 컨디션이 여행 전체를 좌우합니다.'],case:['환승이 두 번 이상이면 최저가보다 환승시간과 지연 대안을 먼저 보세요.','출장이라면 도착 당일 중요한 미팅보다 하루 전 이동이 가능한지 확인하세요.']},
 '건강':{verdict:['사주는 참고만 하세요. 증상은 의료진이 봐야 합니다.'],body:['통증, 출혈, 호흡곤란, 의식 변화처럼 실제 증상이 있으면 운세보다 진료가 먼저입니다.','생활 쪽에서는 수면시간, 식사, 음주, 운동, 회복 시간을 꾸준히 기록하는 정도로 활용하세요.'],case:['검사 결과를 기다리는 상황이라면 사주로 결과를 예측하지 말고 의사의 설명과 추가검사 계획을 확인하세요.']},
 '중요대화':{verdict:['말하세요. 핵심 하나만 꺼내세요.','대화는 가능합니다. 결론을 한 번에 다 받으려 하지 마세요.'],body:['상대가 대답할 수 있는 질문 하나로 끝내세요. 설명을 길게 하면 핵심이 흐려집니다.','돈, 관계, 업무가 한꺼번에 섞여 있다면 오늘은 가장 급한 하나만 다루세요.'],case:['“우리 관계가 왜 이래?”보다 “지난 두 번 약속이 취소됐는데 앞으로 만날 의향이 있는지 알고 싶어”처럼 구체적으로 묻는 편이 낫습니다.','직장에서는 “제가 힘듭니다”보다 “A와 B 중 어느 업무를 먼저 해야 합니까?”가 답을 받기 쉽습니다.']},
 '약속':{verdict:['잡아도 됩니다. 두 시간대를 제시하세요.','약속은 상대가 고르기 쉽게 잡으세요.'],body:['“언제 돼?”보다 “금요일 7시나 토요일 4시 중 어때?”가 좋습니다. 상대가 선택할 여지가 있으면 약속이 빨리 정해집니다.','첫 약속이라면 취소·변경이 쉬운 장소를 잡는 편이 부담이 적습니다.'],case:['상대가 교대근무라면 명리상 좋은 시간보다 쉬는 날을 먼저 받아 그 안에서 시간을 고르세요.','멀리 이동해야 하는 약속은 퇴근 직후보다 주말 오후가 실제 만족도가 높을 수 있습니다.']},
 '일반':{verdict:['작게 먼저 해보세요. 반응을 보고 다음 수를 정하면 됩니다.'],body:['되돌리기 쉬운 행동부터 시작하세요. 큰 결정은 정보가 더 모인 뒤 해도 늦지 않습니다.'],case:['말을 꺼내는 문제라면 한 문장만, 돈을 쓰는 문제라면 작은 금액만, 관계 문제라면 한 번의 만남만 먼저 해보세요.']}
};
function personalized(c,i){if(!c)return'';const sym=c.dm?.symbol||'기운';const trait=c.dm?.traits?.[0]||'';const variants=[
 `당신은 ${c.dm?.name||c.gan} 일간으로, ${sym}처럼 ${trait||'자기 방식이 분명한 편'}으로 읽습니다. 그래서 이번 일도 남이 정한 답보다 <b>내가 감당할 수 있는 선</b>을 먼저 잡는 게 좋습니다.`,
 `${c.dm?.name||c.gan} 일간은 ${sym}에 비유합니다. 지금 질문에서는 장점을 크게 쓰기보다, ${c.high} 기운이 과해지는 방식은 줄이고 ${c.low} 기운에 해당하는 여유·보완을 조금 더 넣는 편이 낫습니다.`,
 `원국에서 ${c.high} 기운이 상대적으로 강하고 ${c.low} 기운이 적게 잡힙니다. 그래서 이번 선택은 “더 세게”보다 <b>빠진 부분 하나를 채우는 식</b>으로 가는 게 균형이 좋습니다.`
 ];return vary(variants,(c.p?.birthDate||'')+i)}
function concrete(i,q){const x=CASES[i]||CASES.일반;return{v:vary(x.verdict,q+i+'v'),b:vary(x.body,q+i+'b'),c:vary(x.case,q+i+'c')}}
function answerSimple(q){const p=profile();if(!p)return'<p>내 사주를 먼저 등록해주세요.</p>';if(asksWhen(q)&&typeof window.answer13==='function')return window.answer13Schedule?window.answer13Schedule(q):null;const i=intent(q),di=todayInfo(),c=context(),x=concrete(i,q),basis=`${daySignal(di)} ${relSignal(di?.rel)}`,person=personalized(c,i);
 const risky=['건강','투자','계약','큰구매','창업'].includes(i);
 return `<div class="v14-answer"><div class="v14-kicker">${i}</div><h2>${x.v}</h2><p class="v14-main">${x.b}</p><div class="v14-example"><b>실제로는 이렇게</b><p>${x.c}</p></div>${!risky?`<div class="v14-person"><b>당신 사주에 겹쳐보면</b><p>${person}</p></div>`:''}<details class="v14-basis"><summary>왜 이렇게 보나요?</summary><p>${basis}</p><p class="tiny">오늘 일진 ${di?ganzhiKo(di.ec.getDay()):'-'} · 내 일지와 ${di?.inter?.type||'평'} · 일간 관계 ${di?.rel||'-'}. 전통 명리 해석의 참고값이며 실제 결과를 보장하지 않습니다.</p></details></div>`}
function schedule14(q){const p=profile();if(!p)return'<p>내 사주를 먼저 등록해주세요.</p>';const i=intent(q);if(typeof window.answer13==='function'){
   // v13 내부 schedule 함수는 비공개라 기존 버튼 핸들러를 우회할 수 없음. 동일한 공개 계산함수로 간결 택일 구현
   const n=new Date();n.setHours(0,0,0,0);let s=new Date(n),e=new Date(n),label='이번 주';const dow=n.getDay();
   if(/다음\s*주/.test(q)){s.setDate(n.getDate()+(7-dow)+(dow===0?1:0));e=new Date(s);e.setDate(s.getDate()+6);label='다음 주'}
   else if(/주말/.test(q)){const sat=(6-dow+7)%7;s.setDate(n.getDate()+sat);e=new Date(s);e.setDate(s.getDate()+1);label='이번 주말'}
   else if(/다음\s*달/.test(q)){s=new Date(n.getFullYear(),n.getMonth()+1,1);e=new Date(n.getFullYear(),n.getMonth()+2,0);label='다음 달'}
   else if(/이번\s*달/.test(q)){e=new Date(n.getFullYear(),n.getMonth()+1,0);label='이번 달'}
   else {e.setDate(n.getDate()+(7-dow));if(dow===0)e=new Date(n)}
   const purpose=(['소개팅','데이트','고백','약속','재회'].includes(i)?'소개팅·만남':['계약','투자','큰구매','창업'].includes(i)?'계약·거래':['이사','여행'].includes(i)?'이사·이동':['시험·공부','면접·취업'].includes(i)?'공부·시험 준비':'중요한 대화');
   const windows=(['소개팅','데이트','고백','약속','재회'].includes(i)?[[15,17],[17,19],[19,21]]:['직장대화','승진·연봉','면접·취업','계약'].includes(i)?[[9,11],[11,13],[13,15],[15,17]]:['이사','여행'].includes(i)?[[7,9],[9,11],[11,13],[13,15]]:[[9,11],[11,13],[15,17],[17,19]]);
   const rows=[];for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1)){const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;try{const di=dayInfo(ds,p);let sc=purposeScore(di,purpose);let bestT={sc:-999,a:windows[0][0],b:windows[0][1],reason:''};for(const [a,b] of windows){try{const y=d.getFullYear(),m=d.getMonth()+1,dd=d.getDate(),sol=Solar.fromYmdHms(y,m,dd,a,0,0),ec=sol.getLunar().getEightChar(),ne=ecFromSolar(solarFromProfile(p),p),ia=interaction(ne.getDayZhi(),ec.getTimeZhi()),ib=interaction(ec.getDayZhi(),ec.getTimeZhi()),r=relation(ne.getDayGan(),ec.getTimeGan());const ts=60+(ia.type==='합'?10:ia.type==='충'?-12:0)+(ib.type==='합'?5:ib.type==='충'?-6:0)+({지원:5,표현:4,관리:3,동질:2,압박:-4}[r]||0);if(ts>bestT.sc)bestT={sc:ts,a,b,ia,ib,r}}catch{}}sc+=Math.round((bestT.sc-60)*.35);rows.push({date:new Date(d),ds,di,sc,t:bestT})}catch{}}
   rows.sort((a,b)=>b.sc-a.sc);const top=rows.slice(0,3);if(!top.length)return'<p>날짜를 계산하지 못했습니다.</p>';const fmt=x=>`${x.date.getMonth()+1}월 ${x.date.getDate()}일 ${WEEK[x.date.getDay()]}요일`,hm=x=>`${String(x.t.a).padStart(2,'0')}:00~${String(x.t.b).padStart(2,'0')}:00`;
   const why=x=>{const a=[];if(x.di.inter?.type==='합')a.push('내 일지와 그날 일지가 합으로 이어집니다');else if(x.di.inter?.type==='충')a.push('내 일지와 그날 일지가 충이라 순위를 조금 낮췄습니다');else a.push('내 일지와 그날 일지의 큰 충돌이 없습니다');if(x.di.rel==='표현')a.push('그날 천간이 말·제안·만남을 꺼내는 흐름입니다');if(x.di.rel==='지원')a.push('그날 천간이 도움과 정보 쪽으로 받쳐줍니다');if(x.t.ia?.type==='합')a.push('추천 시간의 시지도 내 일지와 합입니다');else if(x.t.ia?.type==='충')a.push('추천 시간대는 충을 피한 다른 시간보다 낮게 봅니다');return a.slice(0,3).join('. ')+'.'};
   return `<div class="v14-answer v14-date-answer"><div class="v14-kicker">${label} ${i}</div><h2>${fmt(top[0])}<br><span>${hm(top[0])}</span></h2><p class="v14-main">제가 하나만 고르면 이때입니다. ${why(top[0])}</p><div class="v14-date-list">${top.map((x,k)=>`<div><b>${k+1}순위 · ${fmt(x)}</b><span>${hm(x)}</span><p>${why(x)}</p></div>`).join('')}</div><div class="v14-example"><b>실제로 잡는다면</b><p>${i==='소개팅'?`${fmt(top[0])} ${top[0].t.a}시쯤 괜찮은지 먼저 물어보고, 첫 만남은 식사나 카페 한 곳 정도로 짧게 잡으세요.`:i==='직장대화'?`${hm(top[0])} 안에서 회의 직전은 피하고 20~30분을 따로 잡아, 문제·영향·원하는 결정을 세 줄로 가져가세요.`:`${hm(top[0])}를 1안으로 두고 상대 일정이 안 맞으면 2순위 날짜를 바로 제시하세요.`}</p></div><details class="v14-basis"><summary>택일 근거</summary><p>기간 안의 날짜를 전부 비교해 일주↔일진 관계, 일간 관계, 목적별 전통력 宜/忌, 시주와 내 일지·당일 일지의 합충을 함께 봤습니다. 내부 순위는 성공확률이 아닙니다.</p></details></div>`
 }
 return'<p>택일 계산을 사용할 수 없습니다.</p>'
}
function run(){const q=$('#askText')?.value.trim();if(!q)return alert('궁금한 내용을 적어주세요.');const out=$('#askResult');out.hidden=false;out.innerHTML=asksWhen(q)?schedule14(q):answerSimple(q);out.scrollIntoView({behavior:'smooth',block:'start'})}
function brand(){document.title='사주톡톡 · 사주를 쉽게 풀어주는 앱';document.querySelectorAll('.brand').forEach(x=>x.textContent='사주톡톡');const sub=$('.top .sub');if(sub)sub.textContent='어렵지 않게, 사람 말로 보는 내 사주';const scenes={home:['오늘','오늘 운, 딱 필요한 만큼','오늘의 흐름과 행동 한 가지를 먼저 봅니다.'],ask:['사주상담','궁금한 걸 그대로 물어보세요','돌려 말하지 않고 실제 상황에 맞춰 답합니다.'],calendar:['좋은 날','언제 하면 좋은지 골라드립니다','날짜와 시간, 그리고 이유까지 간단히 봅니다.'],profile:['내 사주','내 사주를 쉽게 풀어봅니다','전문 용어는 접어두고 성향과 흐름부터 봅니다.'],match:['궁합','둘의 차이를 먼저 봅니다','잘 맞고 안 맞고보다 실제 관계에서 부딪히는 지점을 봅니다.']};for(const [id,v] of Object.entries(scenes)){const s=document.querySelector(`#${id} .scene-head`);if(s){s.querySelector('span').textContent=v[0];s.querySelector('strong').textContent=v[1];s.querySelector('small').textContent=v[2]}}
 const btn=$('#askBtn');if(btn){btn.onclick=run;btn.textContent='바로 풀어보기'}
 document.querySelectorAll('.nav button').forEach(b=>{const m={home:'오늘',ask:'상담',calendar:'좋은날',profile:'내사주',match:'궁합',more:'설정'};const sp=b.querySelector('span');if(sp)sp.textContent=m[b.dataset.screen]||sp.textContent});
 const quick=$('#ask .quickchips');if(quick)quick.innerHTML='<button data-q="이번 주 소개팅은 언제가 좋아? 날짜와 시간까지 알려줘">소개팅</button><button data-q="팀장에게 업무량 이야기를 어떻게 꺼낼까?">직장</button><button data-q="요즘 이직을 고민하는데 어떻게 봐?">이직</button><button data-q="좋아하는 사람에게 연락해도 될까?">연애</button>';
 document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{$('#askText').value=b.dataset.q});
 const ph=$('#askText');if(ph)ph.placeholder='예: 이번 주 소개팅은 언제가 좋아? / 이직해도 될까?';
 const more=$('#more .stack.small div');if(more)more.innerHTML='<b>버전</b> 14.0 · 사주톡톡';
}
function profileNote(){const r=$('#profileResult');if(!r||r.hidden||$('#v14-profile-note'))return;const c=context();if(!c)return;const d=document.createElement('div');d.id='v14-profile-note';d.className='v14-profile-note';d.innerHTML=`<small>한마디로 보면</small><h3>${c.dm?.name||c.gan} 일간 · ${c.dm?.symbol||''}</h3><p>${c.dm?.summary||''}</p><div><b>강하게 보이는 기운</b> ${c.high} <span>·</span> <b>보완할 기운</b> ${c.low}</div>`;r.insertBefore(d,r.firstChild)}
const old=window.renderProfile;if(typeof old==='function')window.renderProfile=function(){old();setTimeout(profileNote,0)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{brand();setTimeout(profileNote,50)});else{brand();setTimeout(profileNote,50)}
window.sajuTalkRun=run;
})();
