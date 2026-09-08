// 오늘결 8.0 · 통합상담 끝판왕 레이어
// 기존 만세력 계산값은 app.js가 담당하고, 이 파일은 해설·구성·개인화 경험을 강화합니다.
(function(){
  'use strict';
  const V='8.0';
  const $q=(s,r=document)=>r.querySelector(s);
  const $$q=(s,r=document)=>[...r.querySelectorAll(s)];
  const PAST_KEY='todaygyeol_past_review_v1';

  const CONNECTORS=[
    '이 부분은 앞에서 본 성향과 연결해서 보면 이해가 쉽습니다.',
    '여기서는 조금 다르게 봐야 합니다.',
    '실제 생활에서는 이런 장면으로 나타날 수 있습니다.',
    '한 가지를 기억하시면 좋겠습니다.',
    '이 대목은 꽤 중요합니다.',
    '반대로 생각하면 더 이해가 쉽습니다.',
    '직접 겪는 장면으로 바꿔 말해볼게요.',
    '숫자보다 실제 생활에 대입해서 보겠습니다.',
    '이건 좋다·나쁘다보다 어떻게 쓰느냐가 핵심입니다.',
    '앞의 흐름을 이어서 보면 다음 선택이 보입니다.'
  ];
  const WORK_ROLES={
    甲:['팀이나 프로젝트의 방향을 잡는 역할','장기 계획을 세워 여러 사람을 이끄는 역할','조직의 기준과 우선순위를 정하는 역할'],
    乙:['사람과 부서를 연결해 이해관계를 조정하는 역할','사용자·고객의 요구를 실제 서비스로 바꾸는 역할','부드럽게 설득하면서 협업을 이어가는 역할'],
    丙:['발표·영업·홍보처럼 밖으로 보여주는 역할','사람의 반응을 끌어내고 분위기를 움직이는 역할','콘텐츠나 브랜드를 전면에서 알리는 역할'],
    丁:['작은 차이를 오래 관찰해 완성도를 높이는 역할','교육·상담처럼 한 사람을 깊이 보는 역할','기획과 편집처럼 세밀하게 다듬는 역할'],
    戊:['시설·조직·사업의 기반을 안정시키는 역할','운영 기준을 만들고 흔들리는 일을 정리하는 역할','여러 이해관계 속에서 중심을 잡는 역할'],
    己:['현장의 작은 문제를 미리 발견하는 역할','돌봄·지원·품질처럼 생활 수준의 문제를 해결하는 역할','꼼꼼한 실무로 신뢰를 쌓는 역할'],
    庚:['사고·장애·위기 상황에서 빠르게 기준을 세우는 역할','보안·안전·감사처럼 원칙을 적용하는 역할','문제를 잘라내고 결정하는 역할'],
    辛:['오류를 찾아 정확도를 높이는 역할','회계·품질·데이터처럼 기준을 정밀하게 적용하는 역할','작은 차이가 결과를 바꾸는 전문 역할'],
    壬:['여러 정보·지역·사람을 연결해 새 기회를 만드는 역할','신사업·전략처럼 큰 흐름을 읽는 역할','시장·물류·플랫폼처럼 움직이는 구조를 다루는 역할'],
    癸:['보이지 않는 원인과 패턴을 찾아내는 역할','상담·리서치처럼 사람의 미묘한 반응을 읽는 역할','데이터와 자료를 모아 핵심을 짚는 역할']
  };
  const MONEY_STYLE={
    목:{earn:'새로운 기회를 만들거나 성장 가능성에 투자할 때 돈과 연결되기 쉽습니다.',save:'목표를 숫자로 정해두면 모으는 힘이 좋아집니다.',leak:'배움·장비·새로운 시도에 지출이 커질 수 있습니다.',big:'큰돈은 “미래에 좋아질 것 같다”는 기대보다 회수기간과 유지비를 따져보세요.'},
    화:{earn:'성과를 보여주거나 사람을 만나 움직일 때 수입 기회가 커질 수 있습니다.',save:'수입이 늘어난 달에 생활수준을 바로 높이지 않는 습관이 중요합니다.',leak:'기분이 좋아질수록 모임·취미·외식 같은 활동성 지출이 늘기 쉽습니다.',big:'큰 지출은 흥분이 가라앉은 다음날 한 번 더 보세요.'},
    토:{earn:'꾸준히 책임을 맡고 신뢰를 쌓으면서 돈이 안정되는 방식과 잘 맞습니다.',save:'현금·저축·고정자산처럼 눈에 보이는 기반을 만드는 데 강점이 있습니다.',leak:'가족·주거·차량처럼 책임성 비용을 혼자 떠안을 수 있습니다.',big:'부동산·대출·장기계약은 월 부담액뿐 아니라 중도해지와 유지비를 함께 계산하세요.'},
    금:{earn:'전문성·정확성·기준을 인정받을 때 수입과 연결되기 쉽습니다.',save:'불필요한 소비를 줄이고 효율을 높이는 능력이 좋습니다.',leak:'좋은 품질을 고르느라 단가가 올라가거나, 완벽한 선택을 하려다 비용이 커질 수 있습니다.',big:'가격보다 품질을 보는 장점은 살리되 총예산 상한선을 먼저 정하세요.'},
    수:{earn:'정보·사람·기회를 연결하면서 수입 가능성이 생기는 편입니다.',save:'선택지가 많을수록 자동이체와 계좌 분리처럼 단순한 규칙이 필요합니다.',leak:'여러 기회를 동시에 잡으려다 소액이 여러 곳으로 흩어질 수 있습니다.',big:'투자든 사업이든 한 번에 여러 방향으로 확장하지 말고 우선순위를 좁혀보세요.'}
  };
  const LOVE_STYLE={
    목:{pull:'자기 삶의 방향이 분명하고 성장 의지가 있는 사람',fit:'약속을 지키면서 서로의 성장을 응원하는 사람',conflict:'상대가 지나치게 수동적이거나 발전 의지가 없어 보일 때 답답함이 쌓일 수 있습니다.'},
    화:{pull:'표현이 빠르고 분위기를 밝게 만드는 사람',fit:'감정을 숨기지 않되 기복이 지나치지 않은 사람',conflict:'감정이 올라온 순간 말이 커지거나 너무 빠른 결론을 내리면 관계가 소모될 수 있습니다.'},
    토:{pull:'생활이 안정적이고 믿음을 주는 사람',fit:'약속·시간·돈 문제를 현실적으로 함께 맞춰가는 사람',conflict:'내가 책임을 많이 지고도 표현하지 않다가 어느 순간 서운함이 터질 수 있습니다.'},
    금:{pull:'깔끔하고 자기 기준이 분명한 사람',fit:'예의를 지키면서도 서로의 경계를 존중하는 사람',conflict:'맞고 틀림을 따지다 감정의 이유를 놓치면 상대가 차갑다고 느낄 수 있습니다.'},
    수:{pull:'대화가 잘 통하고 새로운 이야기를 함께 나눌 수 있는 사람',fit:'자유를 주면서도 필요할 때 안정감을 주는 사람',conflict:'혼자 생각을 너무 많이 하거나 가능성을 여러 방향으로 열어두면 상대가 불안해할 수 있습니다.'}
  };

  function hash(v){let h=2166136261;for(const ch of String(v)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return Math.abs(h>>>0)}
  function pick(seed,arr){return arr[hash(seed)%arr.length]}
  function uniqueSentences(text){
    const seen=new Set();
    return String(text).split(/(?<=[.!?。])\s+/).filter(s=>{const k=s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();if(!k||seen.has(k))return false;seen.add(k);return true}).join(' ');
  }
  function currentContext(){
    const p=profile(); if(!p) return null;
    const ec=ecFromSolar(solarFromProfile(p),p), c=countElements(ec,p), entries=Object.entries(c).sort((a,b)=>b[1]-a[1]);
    return {p,ec,c,high:entries[0]?.[0]||'토',low:[...entries].sort((a,b)=>a[1]-b[1])[0]?.[0]||'수',dm:DAYMASTER[ec.getDayGan()]||{},now:new Date().getFullYear()};
  }
  function monthScore(r){return 70+({지원:8,표현:5,동질:4,관리:2,압박:-7,중립:0}[r.rel]||0)+(r.inter.type==='합'?9:r.inter.type==='충'?-10:0)}

  function threeYearHtml(ec,p,now){
    const ys=[0,1,2].map(k=>v7yearCounsel(ec,p,now+k));
    const short=x=>({
      overall:x.d.it.type==='합'?'연결·협력':x.d.it.type==='충'?'변화·조정':x.d.rel==='표현'?'실행·표현':x.d.rel==='관리'?'정리·관리':x.d.rel==='지원'?'배움·지원':x.d.rel==='압박'?'책임·선택':'기반 다지기',
      work:x.d.rel==='표현'?'지원·발표·성과 공개':x.d.rel==='관리'?'계약·실적·예산':x.d.rel==='지원'?'배움·협업·자격':x.d.rel==='압박'?'역할조정·체력관리':'완성도·기록',
      money:x.d.rel==='관리'?'고정비·계약 점검':x.d.rel==='압박'?'비상금·예상외 지출':x.d.rel==='표현'?'수입과 지출 동시 확대':'지출 습관 정리',
      relation:x.d.it.type==='합'?'새 연결·화해':x.d.it.type==='충'?'거리 조정·오해 관리':'약속과 일관성'
    });
    return `<div class="v8-three"><div class="v8-compare">${ys.map(x=>{const s=short(x);return `<article><span>${x.d.y}년</span><b>${s.overall}</b><p><strong>일</strong>${s.work}</p><p><strong>돈</strong>${s.money}</p><p><strong>관계</strong>${s.relation}</p></article>`}).join('')}</div><div class="reader-session"><h4>그래서 앞으로 3년은 이렇게 보내세요</h4><p>${ys[0].d.y}년에는 <b>${short(ys[0]).overall}</b>에 초점을 맞추고, ${ys[1].d.y}년에는 <b>${short(ys[1]).overall}</b> 쪽으로 무게를 옮겨가세요. ${ys[2].d.y}년은 앞의 두 해에서 준비한 것을 <b>${short(ys[2]).overall}</b> 방식으로 쓰는 해라고 보면 이해가 쉽습니다.</p><p>${pick(ec.getDay()+now,CONNECTORS)} 세 해를 똑같이 보내기보다, 해마다 요구하는 역할을 바꿔주는 것이 핵심입니다.</p></div></div>`;
  }

  function keyMonthsHtml(ec){
    const rows=monthlyLuckRows(ec).map((r,i)=>({...r,i,score:monthScore(r)}));
    const best=[...rows].sort((a,b)=>b.score-a.score)[0];
    const caution=[...rows].sort((a,b)=>a.score-b.score)[0];
    const relation=rows.find(r=>r.inter.type==='합')||[...rows].sort((a,b)=>b.score-a.score)[1]||best;
    const career=rows.find(r=>['표현','지원','관리'].includes(r.rel)&&r.score>=72)||best;
    const fmt=r=>`${r.y}년 ${r.m}월`;
    return `<div class="v8-keymonths"><article class="good"><span>올해 가장 활용할 달</span><b>${fmt(best)}</b><p>${best.inter.type==='합'?'사람·협업·연결을 통해 일이 풀릴 여지가 큽니다.':'내가 준비한 일을 실제 행동으로 옮기기 좋은 달입니다.'}</p></article><article><span>일·직장에 힘쓸 달</span><b>${fmt(career)}</b><p>${career.rel==='표현'?'지원·발표·면접·성과 공개처럼 밖으로 보여주는 행동을 해보세요.':career.rel==='지원'?'교육·자격·협업·도움 요청을 활용하세요.':'계약·예산·실적처럼 숫자로 남는 일을 정리하기 좋습니다.'}</p></article><article><span>관계에 활용할 달</span><b>${fmt(relation)}</b><p>${relation.inter.type==='합'?'미뤄둔 연락, 소개, 화해, 중요한 대화를 자연스럽게 꺼내볼 만합니다.':'큰 이벤트보다 약속을 지키고 대화를 이어가는 기본이 중요합니다.'}</p></article><article class="care"><span>한 번 더 확인할 달</span><b>${fmt(caution)}</b><p>${caution.inter.type==='충'?'이직·이사·계약·관계정리처럼 되돌리기 어려운 결정은 하루 이상 두고 판단하세요.':'일정과 체력이 몰릴 수 있으니 새 일을 늘리기 전에 현재 부담부터 확인하세요.'}</p></article></div>`;
  }

  function careerDeepHtml(ctx){
    const {ec,p}=ctx, gan=ec.getDayGan(), d=CAREER_DETAIL[gan]||CAREER_DETAIL.壬, roles=WORK_ROLES[gan]||WORK_ROLES.壬;
    const topYears=[];for(let y=ctx.now;y<ctx.now+8;y++){const x=v7yearCounsel(ec,p,y);if(['표현','지원','관리'].includes(x.d.rel)||x.d.it.type==='합')topYears.push(x)}
    const timing=topYears.sort((a,b)=>b.d.score-a.d.score).slice(0,2).map(x=>`${x.d.y}년`).join('·')||'앞으로의 세운 중 표현·지원 흐름이 강한 해';
    return `<section class="v8-deep"><div class="topic-head"><span>직업 · 일</span><h4>어떤 직업보다, 어떤 역할에서 강점이 살아나는지 보겠습니다</h4></div><p>${d.why}에서 힘이 잘 살아납니다. 실제 직업명으로는 아래 분야가 후보가 될 수 있습니다.</p><div class="job-tags">${d.jobs.slice(0,12).map(j=>`<b>${j}</b>`).join('')}</div><div class="v8-subgrid"><div><b>특히 잘 맞는 역할</b>${roles.map(r=>`<p>• ${r}</p>`).join('')}</div><div><b>잘 맞는 조직환경</b><p>${d.env}</p></div><div><b>피로가 빨리 쌓이는 환경</b><p>${d.avoid}</p></div><div><b>이직·승진을 볼 때</b><p>${timing} 전후에는 역할 확대나 새로운 제안을 현실적으로 비교해볼 만합니다. 연봉만 보지 말고 권한·팀 규모·출퇴근·성장 가능성을 함께 보세요.</p></div></div><div class="mini-example"><b>직장에서 실제로는</b>${roles[0]}을 맡았을 때 “내가 왜 이 일을 잘하는지”가 눈에 보일 수 있습니다. 면접이나 평가에서는 결과만 말하지 말고, 문제가 생겼을 때 어떤 기준으로 정리했고 누구와 협업했으며 숫자가 어떻게 바뀌었는지를 사례로 준비하세요.</div></section>`;
  }

  function moneyDeepHtml(ctx){
    const s=MONEY_STYLE[ctx.high]||MONEY_STYLE.토;
    return `<section class="v8-deep"><div class="topic-head"><span>돈 · 재물</span><h4>돈복이라는 한마디보다, 돈이 들어오고 남고 새는 방식을 따로 보겠습니다</h4></div><div class="v8-money"><article><b>버는 돈</b><p>${s.earn}</p></article><article><b>모으는 돈</b><p>${s.save}</p></article><article><b>새는 돈</b><p>${s.leak}</p></article><article><b>큰돈</b><p>${s.big}</p></article></div><p><b>사업·투자는 어떻게 보나요?</b> 사주에서 실행력이나 관리 성향은 참고할 수 있지만, 수익률이나 성공을 예측할 수는 없습니다. 사업이라면 고객·원가·현금흐름, 투자라면 손실 가능성과 자산배분을 먼저 보세요.</p><div class="mini-example"><b>생활 사례</b>월급이나 보너스가 들어오면 ‘생활비·비상금·장기목표’로 먼저 나누고, 계획에 없던 큰 구매는 최소 하루 뒤 다시 보는 규칙을 두면 ${ctx.high} 기운의 장점은 살리고 과한 쏠림은 줄이는 데 도움이 됩니다.</div></section>`;
  }

  function loveDeepHtml(ctx){
    const s=LOVE_STYLE[ctx.high]||LOVE_STYLE.수, comp=COMPLEMENT[ctx.low];
    const years=[];for(let y=ctx.now;y<ctx.now+10;y++){const x=v7yearCounsel(ctx.ec,ctx.p,y);if(x.d.it.type==='합'||x.d.rel==='지원'||x.d.rel==='표현')years.push(x)}
    const timing=years.sort((a,b)=>b.d.score-a.d.score).slice(0,3).map(x=>`${x.d.y}년`).join(' · ')||'사람·표현 흐름이 부드러운 해';
    return `<section class="v8-deep"><div class="topic-head"><span>연애 · 결혼 · 인연</span><h4>끌리는 사람과 오래 편한 사람은 다를 수 있습니다</h4></div><div class="v8-subgrid"><div><b>첫눈에 끌리기 쉬운 타입</b><p>${s.pull}</p></div><div><b>장기적으로 편한 타입</b><p>${s.fit}</p></div><div><b>반복되기 쉬운 갈등</b><p>${s.conflict}</p></div><div><b>인연 흐름을 활용할 시기</b><p>${timing} 전후에는 소개·모임·관계 회복처럼 사람을 만나는 행동을 조금 더 적극적으로 해볼 수 있습니다.</p></div></div><p>오행 보완만 보면 <b>${comp?.zodiacs?.join(' · ')||'상대 전체 사주 확인'}</b>, 생월은 <b>${comp?.months?.map(m=>m+'월생').join(' · ')||'상대 전체 사주 확인'}</b>을 참고할 수 있습니다. 하지만 띠나 생월만으로 결혼궁합을 결정하지는 않습니다.</p><div class="mini-example"><b>갈등 상황을 예로 들면</b>답장이 늦거나 상대 표정이 평소와 다르다고 혼자 결론내리기보다 “오늘 많이 바빴어?”라고 사실부터 확인하세요. 서운함이 10이 될 때까지 참았다가 폭발하기보다 3 정도일 때 짧게 말하는 편이 관계를 오래 지키는 데 도움이 됩니다.</div></section>`;
  }

  function lifestyleDeepHtml(ctx){
    const high=ctx.high, low=ctx.low;
    return `<section class="v8-deep"><div class="topic-head"><span>생활 · 컨디션</span><h4>질병을 맞히는 것이 아니라, 지치기 쉬운 생활 패턴을 관리하는 쪽으로 보겠습니다</h4></div><p>${high} 기운이 강한 사람은 ${ELEMENT_TONE[high]?.risk||'한 가지 방식에 오래 몰입하는 경향'}이 피로로 이어질 수 있습니다. 반대로 ${low} 기운의 ${ELEMENT_TONE[low]?.use||'다른 생활 방식'}을 일부러 섞어주는 것이 균형에 도움이 됩니다.</p><div class="v8-subgrid"><div><b>업무가 몰릴 때</b><p>잠을 줄여 버티기보다 일정 하나를 덜어내고, 회복 시간을 먼저 확보하세요.</p></div><div><b>생각이 많아질 때</b><p>머릿속에서 계속 정리하기보다 걷기·가벼운 운동·메모처럼 몸과 밖으로 꺼내는 루틴을 만들어보세요.</p></div><div><b>일정이 좋은 달에도</b><p>약속을 연속으로 잡지 말고 중요한 일정 전후에 빈 시간을 남겨두는 편이 좋습니다.</p></div><div><b>건강에 관한 원칙</b><p>사주로 질병이나 장기 상태를 판단하지 않습니다. 실제 증상은 검진과 의료진 판단이 우선입니다.</p></div></div></section>`;
  }

  function integratedReportHtml(ctx){
    const {ec,p,now,high,low,dm}=ctx, ld=currentLuckData(ec,p,now), y=v7yearCounsel(ec,p,now), n=v7yearCounsel(ec,p,now+1);
    const ys=[];for(let yr=now;yr<now+12;yr++)ys.push(v7yearCounsel(ec,p,yr));
    const best=[...ys].sort((a,b)=>b.d.score-a.d.score).slice(0,2), care=[...ys].sort((a,b)=>a.d.score-b.d.score).slice(0,2);
    const start=ld.start?.toYmd?.()||ld.start?.toString?.()||'', cur=ld.cur, next=ld.next;
    const firstName=p.name||'당신';
    return `<div class="v8-integrated"><div class="reader-mark">${firstName}님의 사주를 처음부터 한 번에 이어서 풀어볼게요</div><h3>한 사람의 이야기처럼 보면 이렇게 읽힙니다</h3><p>${firstName}님의 중심은 <b>${dm.name||ganzhiKo(ec.getDayGan())}</b>입니다. ${dm.summary||''} 여덟 글자를 함께 보면 <b>${high} 기운은 자연스럽게 많이 쓰고, ${low} 기운은 상대적으로 덜 쓰는 편</b>입니다. 그래서 잘하는 방식은 더 선명하게 살리되, 일이 막힐 때는 일부러 ${low}의 방식을 꺼내 쓰는 것이 균형을 만듭니다.</p><p>${pick(ec.getDay()+'a',CONNECTORS)} 예를 들어 평소 문제를 혼자 정리하고 책임지는 쪽이라면, 모든 문제를 혼자 끝내기보다 필요한 순간에 도움을 요청하거나 역할을 나누는 것이 오히려 운을 잘 쓰는 방식이 됩니다.</p><h4>대운부터 짚어볼게요</h4><p>${start?`첫 대운은 <b>${start}</b> 전후부터 시작한 것으로 계산됩니다.`:'첫 대운 시작 시점은 만세력 계산값을 기준으로 확인합니다.'} ${cur?`현재는 <b>${cur.sy}년부터 ${cur.ey}년까지 ${ganzhiKo(cur.gz)} 대운</b> 안에 있습니다.`:'현재 대운 구간은 전문 만세력에서 확인할 수 있습니다.'} 대운은 약 10년 동안 깔리는 큰 배경이라, 같은 해라도 어떤 대운 안에 있는지에 따라 체감이 달라질 수 있습니다.</p><p>${next?`다음 큰 전환은 <b>${next.sy}년경 ${ganzhiKo(next.gz)} 대운</b>으로 넘어갈 때입니다. 대운이 바뀌는 전후에는 직업·거주·관계·관심사의 우선순위가 달라지는 느낌이 생길 수 있으니, 그 시기에는 무엇을 버리고 무엇을 가져갈지 비교해보는 것이 중요합니다.`:'다음 대운 전환은 계산된 대운표를 참고하세요.'}</p><h4>${now}년, 지금은 어떤 해인가요?</h4><p>${uniqueSentences(y.overall+' '+y.career+' '+y.money+' '+y.relation)}</p><h4>${now+1}년은 무엇이 달라지나요?</h4><p>${uniqueSentences(`올해가 ${y.theme.title} 쪽이라면 내년은 ${n.theme.title} 쪽으로 무게가 이동합니다. ${n.overall} ${n.action}`)}</p><h4>앞으로 눈여겨볼 해</h4><p><b>${best.map(x=>x.d.y+'년').join(' · ')}</b>은 앞으로 12년 중 상대적으로 힘을 써볼 만한 해로 추렸습니다. 이때는 기다리는 것보다 준비한 것을 밖으로 꺼내거나 사람과 연결하는 행동이 더 중요합니다. 반대로 <b>${care.map(x=>x.d.y+'년').join(' · ')}</b>은 결정 속도를 늦추고 계약·돈·체력·관계의 조건을 한 번 더 확인하는 편이 좋습니다.</p><div class="reader-em"><b>사주 선생님이 마지막에 한마디로 정리한다면</b><br>${firstName}님은 ‘운이 오기만 기다리는 사람’보다, 흐름이 좋아질 때 쓸 준비를 미리 해두었을 때 강한 사람으로 보는 편이 맞습니다. 좋은 해에는 실행하고, 변화가 큰 해에는 비교하고, 평범한 해에는 실력과 돈·생활 기반을 다지는 식으로 역할을 바꿔가세요.</div></div>`;
  }

  function finalSummaryHtml(ctx){
    const years=[];for(let y=ctx.now;y<ctx.now+12;y++)years.push(v7yearCounsel(ctx.ec,ctx.p,y));
    const best=[...years].sort((a,b)=>b.d.score-a.d.score)[0], care=[...years].sort((a,b)=>a.d.score-b.d.score)[0];
    const months=monthlyLuckRows(ctx.ec).map(r=>({...r,score:monthScore(r)})), bm=[...months].sort((a,b)=>b.score-a.score)[0], cm=[...months].sort((a,b)=>a.score-b.score)[0];
    return `<div class="v8-final"><span>상담의 마지막 정리</span><h3>${ctx.p.name||'당신'}의 사주를 한마디로 정리하면</h3><p>${ctx.dm.summary||''} ${ctx.high} 기운의 강점을 잘 쓰되 ${ctx.low} 기운의 방식을 필요할 때 꺼내 쓰는 것이 전체 균형의 핵심입니다. 앞으로의 운은 한 해가 모든 것을 결정하기보다, 대운이라는 큰 배경 위에서 해와 달마다 역할이 바뀐다고 이해하면 가장 쉽습니다.</p><div class="v8-threepoints"><div><b>① 가까운 좋은 시기</b><p>${best.d.y}년과 ${bm.y}년 ${bm.m}월은 상대적으로 실행·연결에 힘을 써볼 만합니다.</p></div><div><b>② 속도를 늦출 시기</b><p>${care.d.y}년과 ${cm.y}년 ${cm.m}월은 큰 계약·이직·관계 결론을 한 번 더 확인하세요.</p></div><div><b>③ 지금부터 할 일</b><p>직업에서는 성과 사례를 기록하고, 돈에서는 비상금과 고정비를 정리하고, 관계에서는 추측보다 확인하는 습관을 만들어두세요.</p></div></div></div>`;
  }

  function pastReviewHtml(ctx){
    const saved=JSON.parse(localStorage.getItem(PAST_KEY)||'{}'), rows=[];
    for(let y=ctx.now-5;y<ctx.now;y++){const x=v7yearCounsel(ctx.ec,ctx.p,y);rows.push(x)}
    return `<div class="v8-past"><p class="guide-copy">과거 흐름은 “맞히기”가 아니라 내가 어떤 설명에 공감하는지 확인하는 용도입니다. 응답은 이 기기에만 저장되고 사주 계산값은 바뀌지 않습니다.</p>${rows.reverse().map(x=>{const val=saved[x.d.y]||'';return `<article><div><b>${x.d.y}년 · ${x.d.grade.label}</b><p>${x.d.it.type==='합'?'사람·협업·관계의 연결이 두드러졌을 가능성을 봅니다.':x.d.it.type==='충'?'직장·관계·생활패턴에서 변화나 조정이 있었는지 돌아보세요.':`${x.theme.title}의 성격이 생활에서 어떻게 나타났는지 돌아보세요.`}</p></div><div class="review-buttons" data-year="${x.d.y}"><button class="${val==='yes'?'on':''}" data-val="yes">맞았어요</button><button class="${val==='maybe'?'on':''}" data-val="maybe">잘 모르겠어요</button><button class="${val==='no'?'on':''}" data-val="no">아니에요</button></div></article>`}).join('')}</div>`;
  }

  function bindPastReview(){
    $$q('.review-buttons').forEach(g=>{if(g.dataset.bound)return;g.dataset.bound='1';g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const obj=JSON.parse(localStorage.getItem(PAST_KEY)||'{}');obj[g.dataset.year]=b.dataset.val;localStorage.setItem(PAST_KEY,JSON.stringify(obj));$$q('button',g).forEach(x=>x.classList.toggle('on',x===b));});});
  }

  // 기존 분야상담을 8.0 심화 버전으로 교체
  if(typeof window.분야상담==='function' || typeof 분야상담==='function'){
    window.분야상담=function(ec,c){const p=profile();const ctx=currentContext();if(!ctx)return '';return `<div class="v8-domain">${careerDeepHtml(ctx)}${moneyDeepHtml(ctx)}${loveDeepHtml(ctx)}${lifestyleDeepHtml(ctx)}</div>`};
  }

  // LLM 프롬프트를 통합상담용으로 확장
  window.buildLocalLlmPrompt=async function(){
    const ctx=currentContext(); if(!ctx) throw Error('프로필을 먼저 저장하세요.');
    const {p,ec,now,high,low}=ctx, ld=currentLuckData(ec,p,now), years=[], months=monthlyLuckRows(ec).map(r=>({...r,score:monthScore(r)}));
    for(let y=now;y<now+10;y++){const x=v7yearCounsel(ec,p,y);years.push({year:y,grade:x.d.grade.label,relation:x.d.rel,interaction:x.d.it.type,summary:x.overall,career:x.career,money:x.money,relation_text:x.relation,lifestyle:x.body})}
    return `당신은 한국의 차분하고 실용적인 사주 상담가입니다. 아래 계산값은 이미 만세력/규칙 엔진이 만든 데이터이며 절대로 바꾸지 마세요. 새로운 대운 시작연도나 사건을 만들어내지 마세요. 같은 문장과 같은 조언을 반복하지 말고, 실제 상담 자리에서 사람에게 말하듯 부드러운 한국어로 3000~4500자 정도의 통합 상담문을 작성하세요. 반드시 다음 순서로 설명하세요: 1) 타고난 성향 2) 직업과 구체적 직무 예시 3) 돈을 버는/모으는/새는 패턴 4) 연애와 결혼에서 끌리는 타입과 편한 타입의 차이 5) 현재 대운과 다음 대운 전환 6) 올해와 내년의 차이 7) 앞으로 3년 8) 앞으로 10년 중 특히 활용할 해와 확인할 해 9) 올해의 핵심 달과 조심할 달 10) 마지막 3가지 행동. 매 항목에 현실적인 사례를 최소 하나씩 넣고, 직업명은 실제 직무 5개 이상 제시하세요. 의료·투자·법률 결과는 단정하지 마세요. 미래 사건을 확정적으로 예언하지 말고 '이런 형태로 나타날 수 있다'고 설명하세요.\n\n이름:${p.name||'사용자'}\n원국:${ganzhiKo(ec.getYear())}/${ganzhiKo(ec.getMonth())}/${ganzhiKo(ec.getDay())}/${p.timeKnown==='unknown'?'시주미상':ganzhiKo(ec.getTime())}\n일간:${ganzhiKo(ec.getDayGan())}\n강한오행:${high}\n부족오행:${low}\n현재대운:${ld.cur?`${ld.cur.sy}-${ld.cur.ey} ${ganzhiKo(ld.cur.gz)}`:'미상'}\n다음대운:${ld.next?`${ld.next.sy}-${ld.next.ey} ${ganzhiKo(ld.next.gz)}`:'미상'}\n연도자료:${JSON.stringify(years)}\n월자료:${JSON.stringify(months.map(m=>({year:m.y,month:m.m,relation:m.rel,interaction:m.inter.type,grade:m.g.label,score:m.score})))}`;
  };

  // 로컬 LLM 실행을 긴 상담문에 맞춤
  window.runLocalLlm=async function(){
    const btn=$q('#localLlmBtn'),status=$q('#localLlmStatus'),out=$q('#localLlmResult');if(!btn||!status||!out)return;
    btn.disabled=true;status.textContent='무료 로컬 언어모델을 준비하고 있습니다. 첫 실행은 모델 다운로드 때문에 시간이 걸릴 수 있습니다.';
    try{
      if(!('gpu' in navigator)) throw Error('이 기기/브라우저에서는 WebGPU를 사용할 수 없습니다. 기본 통합상담은 그대로 이용할 수 있습니다.');
      const webllm=await import('https://esm.run/@mlc-ai/web-llm');
      const list=webllm.prebuiltAppConfig?.model_list||[];
      const pref=list.find(x=>/Qwen2\.5-0\.5B-Instruct.*q4f16_1/i.test(x.model_id||''))||list.find(x=>/0\.5B.*Instruct/i.test(x.model_id||''))||list.find(x=>/1B.*Instruct/i.test(x.model_id||''));
      if(!pref) throw Error('가벼운 로컬 상담 모델을 찾지 못했습니다.');
      const prompt=await window.buildLocalLlmPrompt();
      const engine=await webllm.CreateMLCEngine(pref.model_id,{initProgressCallback:r=>{status.textContent=`모델 준비 중 · ${r.text||Math.round((r.progress||0)*100)+'%'}`}});
      status.textContent='계산값은 그대로 두고 10분 상담문처럼 자연스럽게 다시 풀고 있습니다.';
      const res=await engine.chat.completions.create({messages:[{role:'system',content:'계산된 명리 데이터를 바꾸지 않고 중복 없는 한국어 사주 상담문으로 재구성한다.'},{role:'user',content:prompt}],temperature:0.58,max_tokens:3600});
      const text=res.choices?.[0]?.message?.content||'';if(!text)throw Error('로컬 모델이 결과를 만들지 못했습니다.');
      out.hidden=false;out.innerHTML=`<b>AI가 다시 풀어쓴 통합 상담</b><p>${text.replace(/\n\n+/g,'</p><p>').replace(/\n/g,'<br>')}</p>`;status.textContent=`완료 · ${pref.model_id}`;
    }catch(e){status.textContent=`로컬 AI 사용 불가: ${e.message}`;out.hidden=true}
    finally{btn.disabled=false}
  };
  window.bindV7Llm=function(){const b=$q('#localLlmBtn');if(b&&!b.dataset.bound){b.dataset.bound='1';b.onclick=window.runLocalLlm}}

  const prevRender=window.renderProfile||renderProfile;
  window.renderProfile=function(){
    prevRender();
    setTimeout(()=>{
      const ctx=currentContext(); if(!ctx)return;
      const easy=$q('#pt-easy'), flow=$q('#pt-flow');
      if(easy&&!$q('#v8-integrated')){
        const box=document.createElement('div');box.id='v8-integrated';box.innerHTML=`<h3 class="friendly-title">10분 통합 사주상담</h3>${integratedReportHtml(ctx)}`;easy.insertBefore(box,easy.firstChild);
      }
      if(flow&&!$q('#v8-three-year')){
        const box=document.createElement('div');box.id='v8-three-year';box.innerHTML=`<h3 class="friendly-title">앞으로 3년을 먼저 비교해볼게요</h3>${threeYearHtml(ctx.ec,ctx.p,ctx.now)}<h3 class="friendly-title">올해 꼭 기억할 달</h3>${keyMonthsHtml(ctx.ec)}`;flow.insertBefore(box,flow.firstChild);
        const past=document.createElement('div');past.id='v8-past-review';past.innerHTML=`<h3 class="friendly-title">지난 운을 돌아보며 확인하기</h3>${pastReviewHtml(ctx)}`;flow.appendChild(past);
        const fin=document.createElement('div');fin.id='v8-final-summary';fin.innerHTML=finalSummaryHtml(ctx);flow.appendChild(fin);
      }
      const tabs=$$q('.profile-tab');if(tabs[0])tabs[0].textContent='전체상담';if(tabs[1])tabs[1].textContent='앞으로 운';
      const llmBtn=$q('#localLlmBtn');if(llmBtn)llmBtn.textContent='무료 AI로 10분 상담문 다시 풀기';
      bindPastReview();window.bindV7Llm?.();
    },0);
  };

  // 현재 화면이 이미 열린 상태에서 8.0 적용
  try{window.renderProfile();}catch(e){console.warn('v8 render',e)}
  const more=$q('#more .stack.small');if(more){const v=more.querySelector('div');if(v)v.innerHTML='<b>버전</b> 8.0 · 통합상담 끝판왕';}
})();
