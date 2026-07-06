window.CEN_TEMPLE_DATA = window.CEN_TEMPLE_DATA || {};
window.CEN_TEMPLE_DATA.zerubbabel = {
  id: 'zerubbabel',
  title: '스룹바벨 성전 Explorer',
  subtitle: '포로귀환 시대의 회복 성전',
  homeImage: './assets/zerubbabel/scenes/01-drone.jpg',
  basePath: './assets/zerubbabel/scenes/',
  thumbPath: './assets/zerubbabel/thumbs/',
  enabled: true,
  scenes: [
    { id:'01', key:'drone', title:'드론뷰', file:'01-drone.jpg', mode:'contain', fit:1.03, fx:.50, fy:.52, description:'성전 전체, 번제단, 물두멍, 바깥뜰의 배치를 먼저 봅니다.' },
    { id:'02', key:'front', title:'성전 전경', file:'02-temple-front.jpg', mode:'contain', fit:1.08, fx:.50, fy:.55, description:'성전 입구 앞에 섭니다. 이제 바깥뜰에서 성전 안쪽으로 들어갑니다.' },
    { id:'03', key:'court', title:'바깥뜰', file:'03-outer-court.jpg', mode:'contain', fit:1.02, fx:.50, fy:.56, description:'번제단과 물두멍, 성전 입구가 함께 보이는 대표 장면입니다.' },
    { id:'04', key:'altar', title:'번제단', file:'04-altar.jpg', mode:'contain', fit:1.02, fx:.50, fy:.56, description:'제사가 드려지는 자리입니다. 전체 형태가 보이도록 멀리서 시작합니다.' },
    { id:'05', key:'laver', title:'물두멍', file:'05-laver.jpg', mode:'contain', fit:1.02, fx:.50, fy:.55, description:'제사장이 손과 발을 씻으며 정결을 준비하는 곳입니다.' },
    { id:'06', key:'entrance', title:'성전 입구', file:'06-entrance.jpg', mode:'contain', fit:1.06, fx:.52, fy:.54, description:'계단을 올라 성소 앞에 섭니다. 문 너머의 공간이 살짝 보입니다.' },
    { id:'07', key:'holy', title:'성소', file:'07-holy-place.jpg', mode:'contain', fit:1.00, fx:.50, fy:.53, description:'등잔대, 떡상, 분향단이 있는 성소입니다. 휘장은 닫혀 있습니다.' },
    { id:'08', key:'mostholy', title:'지성소', file:'08-holy-of-holies.jpg', mode:'cover', fit:1.00, fx:.50, fy:.51, description:'언약궤와 그룹이 없는 빈 지성소입니다. 비어 있음 자체가 이 성전의 역사입니다.' }
  ]
};
