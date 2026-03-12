try:
    from sentence_transformers import SentenceTransformer
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

import numpy as np

# Load the model lazily
_model = None

def get_model():
    global _model
    if not HAS_TRANSFORMERS:
        raise ImportError("sentence-transformers 라이브러리가 설치되지 않았다덕! pip install sentence-transformers 명령어로 설치해달라덕.")
    if _model is None:
        _model = SentenceTransformer("intfloat/multilingual-e5-small")
    return _model

def get_embedding(text: str) -> list[float]:
    """
    텍스트를 벡터로 변환합니다.
    """
    model = get_model()
    processed_text = f"passage: {text}"
    embedding = model.encode(processed_text)
    return embedding.tolist()
