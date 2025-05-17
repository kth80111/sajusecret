
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', birthdate: '',
    lunarSolar: '양력', birthTime: '모름', gender: '남',
    partnerGender: '', partnerBirthdate: '', partnerLunarSolar: '양력', partnerBirthTime: '모름',
    userQuestion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('제출된 데이터:', formData);
    alert('무료운세 해석 결과가 곧 나옵니다! (데모용)');
  };

  return (
    <>
      <Head>
        <title>사주의 비밀 sajusecret.com</title>
      </Head>
      <main style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>🔮 사주의 비밀 sajusecret.com 🔮</h1>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="이름" onChange={handleChange} required /><br />
          <input name="phone" placeholder="연락처" onChange={handleChange} required /><br />
          <input name="email" placeholder="이메일" onChange={handleChange} required /><br />
          <input name="birthdate" type="date" onChange={handleChange} required /><br />
          <select name="lunarSolar" onChange={handleChange}>
            <option value="양력">양력</option>
            <option value="음력">음력</option>
          </select><br />
          <select name="birthTime" onChange={handleChange}>
            {["모름", "자시", "축시", "인시", "묘시", "진시", "사시", "오시", "미시", "신시", "유시", "술시", "해시"].map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select><br />
          <select name="gender" onChange={handleChange}>
            <option value="남">남</option>
            <option value="여">여</option>
          </select><br />
          <textarea name="userQuestion" placeholder="궁금한 점 (선택)" onChange={handleChange}></textarea><br />
          <button type="submit">사주 해석 보기</button>
        </form>
      </main>
    </>
  );
}
