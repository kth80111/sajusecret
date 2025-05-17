// pages/api/saju.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    name, birthdate, lunar_solar, birth_time,
    gender, partner_gender, partner_birthdate,
    partner_lunar_solar, partner_birth_time, user_question
  } = req.body;

  const partnerBlock = partner_gender ? `상대방 정보:\n성별: ${partner_gender}\n생년월일: ${partner_birthdate} (${partner_lunar_solar})\n태어난 시: ${partner_birth_time}` : '';
  const questionBlock = user_question ? `궁금한 점: ${user_question}` : '';

  const prompt = `
당신은 대한민국 최고의 명리학 사주 전문가입니다.
다음 정보를 바탕으로 '연애운', '궁합', '재물운'에 중점을 두고 해석을 2배 더 풍부하고 상세하게 풀이해 주세요.

[대상자 정보]
이름: ${name}
생년월일: ${birthdate} (${lunar_solar})
태어난 시: ${birth_time}
성별: ${gender}
${partnerBlock}
${questionBlock}
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 7000
    })
  });

  const data = await response.json();

  if (data.choices && data.choices[0]) {
    res.status(200).json({ result: data.choices[0].message.content });
  } else {
    res.status(500).json({ result: `❗ API 오류: ${data?.error?.message || '알 수 없는 오류'}` });
  }
} 
