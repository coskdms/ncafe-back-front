from sentence_transformers import SentenceTransformer
import numpy as np

# Load the model directly
model = SentenceTransformer("intfloat/multilingual-e5-small")

def get_embedding(text: str) -> list[float]:
    """
    텍스트를 384차원 벡터로 변환합니다.
    """
    # e5-small 모델은 "query: " 또는 "passage: " 접두사를 사용하는 것이 좋습니다.
    # 여기서는 저장용이므로 "passage: "를 사용합니다.
    processed_text = f"passage: {text}"
    embedding = model.encode(processed_text)
    return embedding.tolist()
