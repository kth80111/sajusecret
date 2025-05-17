
import streamlit as st
import datetime
import sqlite3
import os
from dotenv import load_dotenv
import requests

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

conn = sqlite3.connect('saju_users.db')
c = conn.cursor()
c.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, phone TEXT, email TEXT,
    birthdate TEXT, lunar_solar TEXT, birth_time TEXT, gender TEXT,
    partner_gender TEXT, partner_birthdate TEXT, partner_lunar_solar TEXT, partner_birth_time TEXT,
    user_question TEXT
)
''')
conn.commit()

def generate_time_options():
    branches = ["자시", "축시", "인시", "묘시", "진시", "사시",
                "오시", "미시", "신시", "유시", "술시", "해시"]
    options = ["모름"]
    for i in range(24):
        branch = branches[(i + 1) // 2 % 12]
        options.append(f"{i:02d}:00 ({branch})")
        options.append(f"{i:02d}:30 ({branch})")
    return options

def get_saju_analysis(name, birthdate, lunar_solar, birth_time_str, birth_time_display, gender, partner_info=None, user_question=None):
    partner_info_block = ""
    if partner_info:
        partner_info_block = (
            f"상대방 정보:\n"
            f"성별: {partner_info.get('gender', '모름')}\n"
            f"생년월일: {partner_info.get('birthdate', '모름')} ({partner_info.get('lunar_solar', '모름')})\n"
            f"태어난 시: {partner_info.get('birth_time_str', '모름')} ({partner_info.get('birth_time_display', '모름')})\n"
        )

    question_block = f"궁금한 점: {user_question}\n" if user_question else ""

    prompt = f"""
당신은 대한민국 최고의 명리학 사주 전문가입니다.
다음 정보를 바탕으로 '연애운', '궁합', '재물운'에 중점을 두고 해석을 2배 더 풍부하고 상세하게 풀이해 주세요.

[지시사항]
1. 해석 첫 문단에는 '{name}'이라는 이름을 사용해 지칭하세요.
2. 이후 해석 전체에서는 반드시 '당신'이라는 표현으로 지칭하세요.
3. 십성, 육친, 신강/신약, 희신/용신/기신, 격국, 지장간 등은 '연애운', '궁합', '재물운'과 연관지어 설명하세요.
4. 연애운: 현재 인연, 성격 궁합, 재회 가능성, 결혼운, 연애 스타일 등 디테일하게 설명하세요.
5. 궁합: 상대방과의 관계 흐름, 인연 깊이, 장단점, 피해야 할 행동 등 실생활 예시와 함께 풍부하게.
6. 재물운: 돈복, 투자운, 사업운, 재테크 타이밍 등을 현실적 예시와 함께 구체적으로.
7. 건강운, 직업운 등은 간략하게 요약만 하세요.
8. 이모티콘(예: 🌿❤️🔥⚠️)을 적극적으로 활용해 주세요.
9. 일반 해석보다 2배 더 풍부하고 디테일하게 설명하세요.

[대상자 정보]
이름: {name}
생년월일: {birthdate} ({lunar_solar})
태어난 시: {birth_time_str if birth_time_str != '모름' else '모름'} ({birth_time_display if birth_time_str != '모름' else '모름'})
성별: {gender}

{partner_info_block}
{question_block}
"""

    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    payload = {"model": "gpt-4o", "messages": [{"role": "user", "content": prompt}], "max_tokens": 7000}
    response = requests.post(url, headers=headers, json=payload)
    result = response.json()

    if 'choices' in result:
        return result['choices'][0]['message']['content'].strip()
    else:
        return f"❗ API 오류: {result.get('error', {}).get('message', '알 수 없는 오류')}"

st.markdown("<h1 style='text-align:center;'>🔮 사주의 비밀 🔮</h1>", unsafe_allow_html=True)

with st.form("saju_form"):
    st.subheader("🔍 개인정보 및 사주 정보 입력")
    name = st.text_input("이름")
    phone = st.text_input("연락처")
    email = st.text_input("이메일")
    birthdate = st.date_input("생년월일", min_value=datetime.date(1955, 1, 1), max_value=datetime.date(2025, 12, 31))
    lunar_solar = st.selectbox("양력/음력", ["양력", "음력"])
    birth_time_option = st.selectbox("태어난 시/분 (30분 단위, 한글 시주)", generate_time_options())
    gender = st.selectbox("성별", ["남", "여"])

    with st.expander("상대방 정보 (선택)"):
        partner_gender = st.selectbox("상대방 성별", ["", "남", "여"])
        partner_birthdate = st.date_input("상대방 생년월일", key="pbd", min_value=datetime.date(1955, 1, 1), max_value=datetime.date(2025, 12, 31))
        partner_lunar_solar = st.selectbox("상대방 양력/음력", ["양력", "음력"], key="plunar")
        partner_birth_time_option = st.selectbox("상대방 태어난 시/분 (30분 단위, 한글 시주)", generate_time_options())

    user_question = st.text_area("궁금한 점 (없으면 전체 사주풀이로 진행됩니다)")

    agree = st.checkbox("개인정보 수집 및 이용에 동의합니다.")
    submitted = st.form_submit_button("사주풀이 보기")

    if submitted and agree:
        birth_time_str = birth_time_option.split(" ")[0]
        birth_time_display = birth_time_option.split("(")[1].strip(")") if birth_time_str != "모름" else "모름"

        partner_info = None
        if partner_gender.strip():
            partner_time_str = partner_birth_time_option.split(" ")[0]
            partner_time_display = partner_birth_time_option.split("(")[1].strip(")") if partner_time_str != "모름" else "모름"
            partner_info = {
                'gender': partner_gender,
                'birthdate': partner_birthdate.isoformat(),
                'lunar_solar': partner_lunar_solar,
                'birth_time_str': partner_time_str,
                'birth_time_display': partner_time_display
            }

        c.execute('''
        INSERT INTO users (name, phone, email, birthdate, lunar_solar, birth_time, gender,
                           partner_gender, partner_birthdate, partner_lunar_solar, partner_birth_time,
                           user_question)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name, phone, email,
            birthdate.isoformat(), lunar_solar, birth_time_str, gender,
            partner_info['gender'] if partner_info else None,
            partner_info['birthdate'] if partner_info else None,
            partner_info['lunar_solar'] if partner_info else None,
            partner_info['birth_time_str'] if partner_info else None,
            user_question
        ))
        conn.commit()

        result = get_saju_analysis(name, birthdate.isoformat(), lunar_solar, birth_time_str, birth_time_display, gender, partner_info, user_question)
        st.subheader("🔎 사주 해석 결과")
        st.text(result)
