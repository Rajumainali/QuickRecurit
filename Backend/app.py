import os
import sys
import json
import re
import fitz  # PyMuPDF
import docx  # python-docx
from sentence_transformers import SentenceTransformer, util

# --- File Processing Functions ---

def extract_text_from_pdf(pdf_path):
    try:
        text = ""
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
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
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    elif file_path.endswith(".txt"):
        return extract_text_from_txt(file_path)
    else:
        return ""

def clean_text(text):
    text = re.sub(r'[^a-zA-Z0-9\s.,;:()\-+/]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# --- Summary Extraction ---

def extract_summary(resume_text):
    summary = {
        "Professional Summary": "",
        "Skills": "",
        "Experience": "",
        "Education": ""
    }

    resume_text = resume_text.replace('\r', '\n')
    resume_text = re.sub(r'\n+', '\n', resume_text)

    lines = [line.strip() for line in resume_text.split('\n') if len(line.strip()) > 30][:3]
    summary["Professional Summary"] = ' '.join(lines)[:300] + '...'

    # Skills
    skills_match = re.search(r'(skills|technical skills|key competencies)[\s:]*([\s\S]*?)(?=\n[A-Z][^\n]*:|\n[A-Z][^\n]+\n|$)', resume_text, re.IGNORECASE)
    if skills_match:
        raw_skills = skills_match.group(2).strip()
        skills = re.split(r'[-•,\n]', raw_skills)
        skills = [s.strip() for s in skills if s.strip()]
        summary["Skills"] = ', '.join(skills[:10]) + '...'
    else:
        summary["Skills"] = "Not specified"

    # Experience
    exp_match = re.search(r'(experience|work history|employment)[\s:]*([\s\S]*?)(?=\n[A-Z][^\n]*:|\n[A-Z][^\n]+\n|$)', resume_text, re.IGNORECASE)
    if exp_match:
        experience = exp_match.group(2).strip()
        summary["Experience"] = experience[:300] + '...'
    else:
        summary["Experience"] = "Not specified"

    # Education
    edu_match = re.search(r'(education|academic background|qualifications)[\s:]*([\s\S]*?)(?=\n[A-Z][^\n]*:|\n[A-Z][^\n]+\n|$)', resume_text, re.IGNORECASE)
    if edu_match:
        education = edu_match.group(2).strip()
        summary["Education"] = education[:200] + '...'
    else:
        summary["Education"] = "Not specified"

    for key in summary:
        summary[key] = clean_text(summary[key]) if summary[key] else "Not specified"

    return summary

# --- Semantic Similarity Matching ---

def semantic_match(job_desc, resumes):
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    job_embedding = model.encode(job_desc, convert_to_tensor=True)
    resume_embeddings = model.encode(resumes, convert_to_tensor=True)
    return util.cos_sim(job_embedding, resume_embeddings)[0]

def classify_strength(score):
    if score >= 0.90:
        return "Excellent Match"
    elif score >= 0.75:
        return "Good Match"
    elif score >= 0.50:
        return "Fair Match"
    return "Poor Match"

# --- Main Execution ---

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python app.py <job_description_file> <resume_file1> [<resume_file2> ...]")
        sys.exit(1)

    job_desc_path = sys.argv[1]
    resume_paths = sys.argv[2:]

    try:
        job_desc_raw = process_file(job_desc_path)
        job_desc = clean_text(job_desc_raw)
    except Exception as e:
        print(json.dumps({"error": f"Failed to read job description: {str(e)}"}))
        sys.exit(1)

    resumes = []
    resume_texts = []
    filenames = []

    for file_path in resume_paths:
        if os.path.isfile(file_path) and file_path.endswith((".pdf", ".docx", ".txt")):
            try:
                full_text = process_file(file_path)
                cleaned_text = clean_text(full_text)
                resumes.append(cleaned_text)
                resume_texts.append(full_text)
                filenames.append(os.path.basename(file_path))
            except Exception as e:
                print(f"Error processing {file_path}: {e}", file=sys.stderr)
        else:
            print(f"Skipped unsupported or missing file: {file_path}", file=sys.stderr)

    if not resumes:
        print(json.dumps({"error": "No valid resumes found"}))
        sys.exit(1)

    similarities = semantic_match(job_desc, resumes)
    results = sorted(zip(filenames, similarities, resume_texts), key=lambda x: x[1], reverse=True)

    output = []
    for filename, score, raw_text in results:
        output.append({
            "Resume Name": filename,
            "Matching Score": f"{score * 100:.2f}",
            "Strength": classify_strength(score),
            "Summary": extract_summary(raw_text)
        })

    print(json.dumps(output, indent=2))
