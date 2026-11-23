import { randomIndex } from './utility.js';

const prefixes = [
  '말랑', '동글', '폭신', '복슬', '졸린', '느긋한', '느린', '수줍은',
  '뚱한', '엉뚱한', '궁금한', '웃는', '반짝', '달빛', '별빛', '새벽',
  '구름', '빗방울', '하품', '콩알', '유자', '복숭아', '레몬', '민트',
  '초코', '단풍', '노을', '밤하늘',
];
const endings = [
  '수달', '토끼', '여우', '펭귄', '고래', '다람쥐', '고양이', '강아지',
  '판다', '햄스터', '오리', '고슴도치', '부엉이', '문어', '해파리', '호랑이',
  '카피바라', '거북이', '도마뱀', '나무늘보', '쿼카', '물개', '병아리', '까치',
  '단추', '찹쌀떡', '푸딩', '주먹밥',
];
const nicknames = prefixes.flatMap(prefix => endings.map(ending => prefix + ending));

export function nameLines(value) {
  return value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

export function randomNickname(existing) {
  const used = new Set(existing.map(name => name.trim().normalize()));
  const available = nicknames.filter(name => !used.has(name));
  return available[randomIndex(available.length)];
}
