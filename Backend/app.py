import os
import sys
import json
import re
import fitz  # PyMuPDF
import docx  # python-docx
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai

# --- Configuration ---
genai.configure(api_key="AIzaSyCsxEPyxSXHsrwi7FjpxUd13SREqmoBu6E")

# --- File Processing Functions ---
def extract_text_from_pdf(pdf_path):
    try:
        with fitz.open(pdf_path) as doc:
            return ''.join([page.get_text() for page in doc])
    except Exception:
        return ""

def extract_text_from_docx(docx_path):
    try:
        doc = docx.Document(docx_path)
        return '\n'.join([para.text for para in doc.paragraphs])
    except Exception:
        return ""

def extract_text_from_txt(txt_path):
    try:
        with open(txt_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        return ""

def process_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    return {
        '.pdf': extract_text_from_pdf,
        '.docx': extract_text_from_docx,
        '.txt': extract_text_from_txt
    }.get(ext, lambda _: "")(file_path)

def clean_text(text):
    return re.sub(r'\s+', ' ', re.sub(r'[^a-zA-Z0-9\s.,;:()\-+/]', '', text)).strip()

# --- Gemini Summary Extractor ---
def get_clean_summary_with_gemini(resume_text):
    prompt = f"""
You are a resume parser. Extract the following sections from the given resume text:

- Professional Summary (2–4 sentences)
- Skills (comma-separated list)
- Experience (bullet points or concise sentences)
- Education (include degree, institution, and year if available)

Return the output strictly as a JSON object like:
{{
  "Professional Summary": "...",
  "Skills": "...",
  "Experience": "...",
  "Education": "..."
}}

Resume Text:
\"\"\"{resume_text}\"\"\"
"""
    try:
        model = genai.GenerativeModel('gemini-2.0-flash')  # or 'gemini-pro'
        response = model.generate_content(prompt)
        raw = response.text.strip()

        # Try to extract JSON block from the output
        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            return json.loads(match.group(0))
        else:
            print("Gemini output not valid JSON:\n", raw)
            return default_summary("Gemini did not return JSON")
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return default_summary("Gemini API Error")

def default_summary(reason="Not Found"):
    return {
        "Professional Summary": reason,
        "Skills": reason,
        "Experience": reason,
        "Education": reason
    }

# --- Semantic Similarity ---
def semantic_match(job_desc, resumes):
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    job_embedding = model.encode(job_desc, convert_to_tensor=True)
    resume_embeddings = model.encode(resumes, convert_to_tensor=True)
    return util.cos_sim(job_embedding, resume_embeddings)[0]

def classify_strength(score):
    return (
        "Excellent Match" if score >= 0.90 else
        "Good Match" if score >= 0.75 else
        "Fair Match" if score >= 0.50 else
        "Poor Match"
    )

# --- Main Execution ---
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python app.py <job_description_file> <resume_file1> [<resume_file2> ...]")
        sys.exit(1)

    job_desc_path, *resume_paths = sys.argv[1:]
    job_desc = clean_text(process_file(job_desc_path))

    resumes_for_model, full_outputs = [], []

    for file_path in resume_paths:
        if os.path.isfile(file_path) and file_path.endswith((".pdf", ".docx", ".txt")):
            try:
                raw_text = process_file(file_path)
                summary = get_clean_summary_with_gemini(raw_text)
                essential_text = ' '.join(summary.values())
                resumes_for_model.append(essential_text)
                full_outputs.append({
                    "filename": os.path.basename(file_path),
                    "raw_summary": summary
                })
            except Exception as e:
                print(f"Error processing {file_path}: {e}", file=sys.stderr)
        else:
            print(f"Skipped unsupported or missing file: {file_path}", file=sys.stderr)

    if not resumes_for_model:
        print(json.dumps({"error": "No valid resumes found"}))
        sys.exit(1)

    similarities = semantic_match(job_desc, resumes_for_model)
    results = sorted(zip(full_outputs, similarities), key=lambda x: x[1], reverse=True)

    output = [{
        "Resume Name": data["filename"],
        "Matching Score": f"{score * 100:.2f}",
        "Strength": classify_strength(score),
        "Summary": data["raw_summary"]
    } for data, score in results]

    print(json.dumps(output, indent=2))