import { Link } from "react-router-dom";

export default function DrishtiTablePage() {
  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>
      <section className="s-pagehead">
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link> / <Link to="/research">Research</Link> / DrishtiTable
          </nav>
        </div>
      </section>

      <section className="s-cs-hero">
        <div className="s-wrap">
          <p className="s-eyebrow">Case study · Reading tables from images</p>
          <h1>Teaching a small model to read tables <span className="hl">better than the frontier</span>.</h1>
          <p className="s-cs-deck">
            A table packs data into rows, columns and merged headers, and to use any of it a model has to rebuild that
            structure exactly, every cell in the right place. Get one wrong and the data is wrong. We took{" "}
            <b>1,421 tables</b> spanning subjects like accounting, statistics and operations research, each labelled by
            hand with its correct structure, and fine-tuned a small open vision-language model to turn a table picture
            into clean, machine-readable HTML. The released model scores <b>83.2% on TEDS</b>, a standard measure of
            how closely the output matches the real table — ahead of every big cloud model we tested, including GPT-4o,
            GPT-5.1 and Gemini 3.1 Pro. The model and a data sample are public.
          </p>
          <div className="s-metastrip">
            <div><div className="mk">Method</div><div className="mv">Supervised fine-tuning (QLoRA)</div></div>
            <div><div className="mk">Domain</div><div className="mv">Table structure recognition</div></div>
            <div><div className="mk">Base model</div><div className="mv">Qwen2.5-VL-7B</div></div>
            <div><div className="mk">Evaluation</div><div className="mv">135 held-out tables · TEDS / S-TEDS</div></div>
          </div>
          <div className="s-cs-stats">
            <div className="c win">
              <div className="num">83.2<span className="u">% TEDS</span></div>
              <div className="lbl">The released fine-tuned model on the 135-table held-out set — the top score of every system we tested.</div>
            </div>
            <div className="c">
              <div className="num">+5.9<span className="u">pts</span></div>
              <div className="lbl">TEDS margin over the strongest frontier cloud model, Claude Sonnet 4.6, on the same tables.</div>
            </div>
            <div className="c">
              <div className="num">1,421</div>
              <div className="lbl">Tables in the whole dataset. Specialisation, not scale, drives the result.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Reproducibility</p>
            <h2>Everything here is public.</h2>
            <p className="lead">The fine-tuned model and a dataset sample are public, and the held-out tables are the same ones every model in the comparison was scored on.</p>
          </div>
          <div className="s-verify-row">
            <a className="s-btn ghost" href="https://huggingface.co/Nalandadata/DrishtiTable-Qwen2.5-VL-7B" target="_blank" rel="noopener noreferrer">Open the model on Hugging Face →</a>
            <a className="s-btn primary" href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer">Download a data sample →</a>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The problem</p>
            <h2>What it takes to read a table correctly.</h2>
            <p className="lead">A table is one of the densest ways a document stores information, and to use any of it you have to recover the structure exactly: which value sits in which row and column, which header spans which cells, how the nesting works. Get one cell wrong and the data it carries is wrong.</p>
            <p className="lead">Frontier vision-language models handle generic web tables well. They struggle on the tables that matter most in practice: the dense, multi-level layouts in financial statements, statistical tables and engineering references, where headers span several rows, cells merge, and columns nest. Those are exactly the tables in Indian academic textbooks, which is why we built the dataset from them: nine textbooks across six subjects, from financial accounting to operations research.</p>
            <p className="lead">What anyone digitising documents wants is plain: hand the model a picture of a table and get back its exact structure as HTML, every cell in the right row and column, every merged header preserved, ready to query. This is where general models break. They read the words but lose the structure, collapsing a multi-row header into one line, merging cells that should stay separate, or dropping a column.</p>
          </div>
          <div className="s-examples">
            <div className="s-ex">
              <div className="subj">Financial · multi-row header</div>
              <p className="q">A ledger with a two- or three-row header — Particulars, then Debit and Credit, then sub-columns — above rows that each align to the deepest heading.</p>
              <p className="chain"><b>What it takes:</b> hold the whole header hierarchy and map every figure to the right leaf column. Flatten the header and every number lands under the wrong heading.</p>
            </div>
            <div className="s-ex">
              <div className="subj">Statistical · merged cells</div>
              <p className="q">A frequency table where one class label spans several rows, or a single heading spans several columns.</p>
              <p className="chain"><b>What it takes:</b> detect each span and reproduce it with the right row and column attributes. Miss a span and every row below shifts out of alignment.</p>
            </div>
            <div className="s-ex">
              <div className="subj">Lookup · dense grid</div>
              <p className="q">A reference grid — interest factors, conversion values — that is mostly numbers under thin headers.</p>
              <p className="chain"><b>What it takes:</b> keep every cell in its exact row and column across a large grid. Drop or shift one and the lookup returns the wrong value.</p>
            </div>
          </div>
          <p className="s-closing">What makes these tables trainable is that the correct structure is unambiguous: there is one right HTML for each, written and checked by an expert. That gold structure is what we fine-tune on, and it is where the approach begins.</p>
        </div>
      </section>

      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The approach</p>
            <h2>What we did, in four steps.</h2>
          </div>
          <div className="s-steps">
            <div className="s-stp">
              <div className="no">01 · Curate</div>
              <h4>Real tables, hard layouts</h4>
              <p><b>1,421 tables</b> from nine Indian academic textbooks across six subjects — financial accounting, business statistics, quantitative techniques, operations research, engineering references and ethics — chosen for the multi-row headers, merged cells and nesting that generic data lacks.</p>
            </div>
            <div className="s-stp">
              <div className="no">02 · Annotate</div>
              <h4>Gold-standard structure</h4>
              <p>Each table annotated as <b>ground-truth HTML</b> with semantic tags and merged-cell attributes, plus a metadata record of domain, table type and structure. Every annotation human-verified.</p>
            </div>
            <div className="s-stp">
              <div className="no">03 · Fine-tune</div>
              <h4>Efficient adaptation (QLoRA)</h4>
              <p>Supervised fine-tuning of an open vision-language model, <b>Qwen2.5-VL-7B</b>, with LoRA adapters on the vision and language layers under 4-bit quantisation. Rank 32, three epochs, on the 1,141-table training split. Modest compute — about 35 minutes on a single A100.</p>
            </div>
            <div className="s-stp">
              <div className="no">04 · Evaluate</div>
              <h4>Held-out, like-for-like</h4>
              <p>TEDS and S-TEDS on a <b>135-table held-out set</b>. Every frontier cloud model was run on the same tables, prompted zero-shot with the identical instruction, so the comparison is like-for-like in-domain.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The result</p>
            <h2>The released fine-tuned model tops every frontier system we tested.</h2>
            <p className="lead">All scores are TEDS and S-TEDS on the same 135-table held-out set. The fine-tuned model is specialised on the domain; the cloud models are general-purpose, prompted zero-shot with the identical instruction.</p>
          </div>
          <div className="s-tablecard">
            <div className="s-tbl-scroll">
              <table>
                <caption>DrishtiTable test set (135 tables) · higher is better</caption>
                <thead>
                  <tr>
                    <th scope="col">Model</th>
                    <th scope="col">Method</th>
                    <th scope="col" style={{ textAlign: "right" }}>TEDS (%)</th>
                    <th scope="col" style={{ textAlign: "right" }}>S-TEDS (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="best"><th scope="row">DrishtiTable-Qwen2.5-VL-7B <span style={{ fontWeight: 400, color: "var(--muted)" }}>· released</span></th><td>Fine-tuned (SFT)</td><td className="pos" style={{ textAlign: "right" }}>83.2</td><td style={{ textAlign: "right" }}>89.7</td></tr>
                  <tr><th scope="row">Claude Sonnet 4.6</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>77.3</td><td style={{ textAlign: "right" }}>89.2</td></tr>
                  <tr><th scope="row">Claude Opus 4.8</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>75.5</td><td style={{ textAlign: "right" }}>88.2</td></tr>
                  <tr><th scope="row">GPT-4o</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>71.1</td><td style={{ textAlign: "right" }}>84.3</td></tr>
                  <tr><th scope="row">GPT-5.1</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>69.9</td><td style={{ textAlign: "right" }}>83.3</td></tr>
                  <tr><th scope="row">Gemini 3.1 Pro</th><td>Zero-shot</td><td style={{ textAlign: "right" }}>65.7</td><td style={{ textAlign: "right" }}>73.6</td></tr>
                </tbody>
              </table>
            </div>
            <p className="cond"><b>How to read this.</b> The fine-tuned model is specialised on the target domain and evaluated on a held-out set; the cloud models are general-purpose, prompted zero-shot with the same instruction. This measures in-domain table structure recognition, not general capability. The publicly released checkpoint is the Qwen2.5-VL-7B at 83.2 TEDS — ahead of every cloud model tested.</p>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Composition</p>
            <h2>What's in the dataset.</h2>
            <p className="lead">The full 1,421-table corpus by table type, subject and complexity. Over 80% are real exam/textbook tables with non-trivial structure.</p>
          </div>
          <div className="s-dist-grid" style={{ marginTop: "8px" }}>
            <div style={{ border: "1px solid var(--line)", borderRadius: "14px", background: "var(--ink-2)", padding: "24px" }}>
              <h4 style={{ fontSize: "15px", textAlign: "center", margin: "0 0 18px", color: "var(--paper)", fontWeight: 600 }}>By table type</h4>
              {[["Statistical", "100%", "684"], ["Financial", "67.1%", "459"], ["Lookup", "31.7%", "217"], ["Comparison", "7.2%", "49"]].map(([label, w, v]) => (
                <div key={label} className="s-bar-row">
                  <span className="s-bar-label">{label}</span>
                  <span className="s-bar-track"><span className="s-bar-fill" style={{ width: w }} /></span>
                  <span className="s-bar-val">{v}</span>
                </div>
              ))}
            </div>
            <div style={{ border: "1px solid var(--line)", borderRadius: "14px", background: "var(--ink-2)", padding: "24px" }}>
              <h4 style={{ fontSize: "15px", textAlign: "center", margin: "0 0 18px", color: "var(--paper)", fontWeight: 600 }}>By subject</h4>
              {[["Bus. Statistics", "100%", "535"], ["Bus. & Finance", "82.1%", "439"], ["Quant / OR", "36.8%", "197"], ["Fin. Accounting", "32%", "171"]].map(([label, w, v]) => (
                <div key={label} className="s-bar-row">
                  <span className="s-bar-label">{label}</span>
                  <span className="s-bar-track"><span className="s-bar-fill" style={{ width: w }} /></span>
                  <span className="s-bar-val">{v}</span>
                </div>
              ))}
            </div>
            <div style={{ border: "1px solid var(--line)", borderRadius: "14px", background: "var(--ink-2)", padding: "24px" }}>
              <h4 style={{ fontSize: "15px", textAlign: "center", margin: "0 0 18px", color: "var(--paper)", fontWeight: 600 }}>By complexity</h4>
              {[["Simple", "100%", "1136"], ["Complex", "25.1%", "285"]].map(([label, w, v]) => (
                <div key={label} className="s-bar-row">
                  <span className="s-bar-label">{label}</span>
                  <span className="s-bar-track"><span className="s-bar-fill" style={{ width: w }} /></span>
                  <span className="s-bar-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The outcome</p>
            <h2>The model now recovers the structure the frontier loses.</h2>
            <p className="lead">Before fine-tuning, general models failed on these tables in specific, recognisable ways. Each is a place where the structure breaks:</p>
          </div>
          <ul className="s-problems">
            <li><b>Collapsed headers.</b> A multi-row header flattened into a single line, so every figure below it lands under the wrong heading.</li>
            <li><b>Mis-merged cells.</b> Cells that should span several rows or columns split apart, or separate cells fused, shifting the whole grid out of alignment.</li>
            <li><b>A dropped or invented column.</b> A column missed entirely, or a phantom one added, so every row after it sits one place off.</li>
            <li><b>Right text, wrong place.</b> The words read correctly but land in the wrong cell. The content is there; the structure is not.</li>
          </ul>
          <p className="s-closing">Fine-tuning on gold-annotated tables fixes these directly, because the model is trained to reproduce the exact structure, cell for cell. On the held-out tables the released fine-tuned model reaches 83.2% TEDS, ahead of every frontier cloud model tested and 5.9 points clear of the strongest, Claude Sonnet 4.6.</p>
          <p className="s-closing">The model and a dataset sample are public. Because the gain came from a small set of gold-annotated tables and an efficient fine-tune, the same recipe carries to any document domain where the structure has to be right — financial statements, regulatory filings, forms, scientific tables.</p>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Reproduce it</p>
            <h2>Run it on your own tables.</h2>
            <p className="lead">The fine-tuned model and a dataset sample are public, so the result can be checked on tables of your own.</p>
          </div>
          <div className="s-repro">
            <div className="s-repro-links">
              <a className="s-rl" href="https://huggingface.co/Nalandadata/DrishtiTable-Qwen2.5-VL-7B" target="_blank" rel="noopener noreferrer">
                <span className="rk">Model · released 7B checkpoint</span>Open on Hugging Face →
              </a>
              <a className="s-rl" href="https://huggingface.co/datasets/Nalandadata/DrishtiTable" target="_blank" rel="noopener noreferrer">
                <span className="rk">Dataset · 20-table public sample</span>Open the dataset →
              </a>
            </div>
            <pre className="s-code">{`from transformers import AutoProcessor, AutoModelForImageTextToText

repo = "Nalandadata/DrishtiTable-Qwen2.5-VL-7B"
model = AutoModelForImageTextToText.from_pretrained(repo, device_map="auto")
processor = AutoProcessor.from_pretrained(repo)

inputs = processor(images=table_image, text="Convert this table to HTML.",
                   return_tensors="pt").to(model.device)
print(processor.decode(model.generate(**inputs)[0], skip_special_tokens=True))`}</pre>
            <p className="s-repro-note">The released checkpoint is the Qwen2.5-VL-7B fine-tune — 83.2% TEDS, ahead of every cloud model tested. A larger Qwen3-VL-8B variant is in progress.</p>
          </div>
        </div>
      </section>

      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Questions</p>
            <h2>The detail behind the result.</h2>
          </div>
          <div className="s-faq" style={{ marginTop: "20px" }}>
            <details>
              <summary>How were the cloud models evaluated?<span className="ic">+</span></summary>
              <div className="ans">Each cloud model was given the same instruction used to fine-tune our models and scored with TEDS and S-TEDS on the identical 135-table held-out set. The fine-tuned models are domain-specialised; the cloud models are general-purpose. The result reflects in-domain table structure recognition, not overall capability.</div>
            </details>
            <details>
              <summary>Why only about 1,400 tables?<span className="ic">+</span></summary>
              <div className="ans">Because quality is the constraint, not quantity. The model specialises from a small set of gold-annotated examples. The point of the work is that the right thousand-odd tables beat a general model trained on far more.</div>
            </details>
            <details>
              <summary>Which model is released?<span className="ic">+</span></summary>
              <div className="ans">The Qwen2.5-VL-7B fine-tune, at 83.2% TEDS — ahead of every cloud model tested. A larger Qwen3-VL-8B variant is in progress and will be published once its evaluation is finalised.</div>
            </details>
            <details>
              <summary>What about structure-only scores?<span className="ic">+</span></summary>
              <div className="ans">On S-TEDS, which scores structure alone and ignores cell content, the strongest cloud model is close. The fine-tune's clearest advantage is on full TEDS, getting the whole table right, content and structure together. Both columns are on this page.</div>
            </details>
            <details>
              <summary>Can we get the data, or data for our own domain?<span className="ic">+</span></summary>
              <div className="ans">Yes. A 20-table sample is public, and the curate-annotate-fine-tune pipeline extends to other structured-document domains. Download a sample, or talk to a researcher to scope it.</div>
            </details>
          </div>
        </div>
      </section>

      <section className="s-band s-cs-cta">
        <div className="s-wrap">
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Try it</p>
          <h2 style={{ maxWidth: "26ch", margin: "0 auto", fontSize: "clamp(25px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, textAlign: "center" }}>Want this accuracy on your own document tables?</h2>
          <div className="s-cta-row">
            <Link className="s-btn primary" to="/#connect">Download a sample</Link>
            <Link className="s-btn ghost" to="/#connect">Talk to a researcher</Link>
          </div>
        </div>
      </section>

      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Related research</p>
            <h2>More of what the data does to a model.</h2>
          </div>
          <div className="s-related">
            <Link className="s-rcc" to="/research/nalandabench">
              <div className="res">+6.3 pts</div>
              <div className="ti">NalandaBench</div>
              <div className="dm">JEE &amp; NEET reasoning · RLVR</div>
              <div className="go">Read the case study →</div>
            </Link>
            <Link className="s-rcc" to="/research/nalanda-image-vl">
              <div className="res">+23.5 pts</div>
              <div className="ti">Nalanda Image VL</div>
              <div className="dm">Multimodal science · vision-language</div>
              <div className="go">Read the case study →</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
