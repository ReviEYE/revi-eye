# 설치 방법
```
git clone https://github.com/ReviEYE/revi-eye.git
cd revi-eye

# 크롬 익스텐션 설치 적용
cd chrome-extension
npm install
npm run build # 이후 /dist 결과물을 chrome에 확장 프로그램에 로드 

# AI 모델 서버 로컬 실행
cd model
pip install -r requirements.txt
uvicorn my_api_server:app --host 0.0.0.0 --port 8000

```
  
## 🔥 소개  
> 본 프로젝트는 한국어로 작성된 짧은 리뷰에 대해 AI 작성 여부 탐지 모델을 개발하고,  
> 그 판단 근거를 명확하게 제공하는 것이 목표이다.  
> 한국어 리뷰 데이터와 AI 생성 데이터를 이용해 모델을 학습시키고,  
> 기존의 자연어 처리 기술(NLP)를 접목시켜 각 리뷰의 특징을 추출하여 탐지의 정확도를 높혔다.  
> 이후 Chrome의 Chat-bot 형태로 서비스를 제공하여,  
> 이용자들이 보다 쉽게 리뷰의 AI 작성 여부를 확인하고 리뷰에 대한 신뢰도를 얻을 수 있게끔 하였다.

<p align="center">

</p>
 
## 📔 문서
📑 [Wiki](https://github.com/ReviEYE/revi-eye/wiki)

## 🧑🏻‍💻 팀원 소개
| 학번_김윤 | 학번_노민혁 | 학번_정기현 | 학번_정세호 |
| :--: | :--: | :--: | :--: |
| <a href="https://github.com/doturak"><img src="https://avatars.githubusercontent.com/u/163323635?s=64&v=4" width="100"></a> | <a href="https://github.com/minhyukroh2"><img src="https://avatars.githubusercontent.com/u/211211199?s=64&v=4" width="100"></a>| <a href="https://github.com/4dong"><img src="https://avatars.githubusercontent.com/u/88959824?s=96&v=4" width="100"></a> | <a href="https://github.com/JeongSH1"><img src="https://avatars.githubusercontent.com/u/125888614?v=4" width="100"></a> |
| [doturak](https://github.com/doturak) | [minhyukroh2](https://github.com/minhyukroh2) | [hogumachu](https://github.com/4dong) | [JeongSH1](https://github.com/JeongSH1) |

## 💡 주요 기능 소개

<table>
    <tr>
    <th style="width: 33%;">.</th>
    <th style="width: 33%;">.</th>
    <th style="width: 33%;">.</th>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td><img src="" style="width: 100%;"/></td>
  </tr>
</table>


## 🛠️ 기술 스택
### chrome-extension
* React + Vite

### AI Model
* FastAPI
* sentence-transformers
* klue/bert base model

## 🏗️ 아키텍처
![아키텍처](https://github.com/user-attachments/assets/e7f928be-8d37-4f0e-a5bf-95da5c00ceb8)

