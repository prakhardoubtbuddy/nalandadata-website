import { Link } from "react-router-dom";

export default function NalandaImageVLPage() {
  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>
      <section className="s-pagehead">
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link> / <Link to="/research">Research</Link> / Nalanda Image VL
          </nav>
        </div>
      </section>

      <section className="s-cs-hero">
        <div className="s-wrap">
          <p className="s-eyebrow">Case study · Science diagram understanding</p>
          <h1>Teaching a vision model to read <span className="hl">science diagrams</span>.</h1>
          <p className="s-cs-deck">
            We wanted a model that could look at a science diagram — a circuit, a molecule, a geometry figure — and
            reason its way to the answer. That's hard, because science diagrams use their own visual shorthand, nothing
            like the everyday photos these models learn from. So we built <b>22,679 science questions</b>, each paired
            with its diagram and a step-by-step worked answer, and fine-tuned a <b>LLaMA-3.2-Vision-11B</b> model on
            them. The key move: we trained the part of the model that sees, not just the part that reads, since the
            seeing is where these models fall short on diagrams. On a held-out set its accuracy rose from 37.7% to{" "}
            <b>50.0%</b>, a <b>12.3-point gain</b>, with mathematics nearly doubling. The model and a dataset sample
            are public.
          </p>
          <div className="s-metastrip">
            <div><div className="mk">Method</div><div className="mv">Visual instruction tuning (QLoRA)</div></div>
            <div><div className="mk">Domain</div><div className="mv">Science diagram understanding</div></div>
            <div><div className="mk">Base model</div><div className="mv">LLaMA-3.2-Vision-11B</div></div>
            <div><div className="mk">Evaluation</div><div className="mv">162 held-out questions · 4 STEM subjects</div></div>
          </div>
          <div className="s-cs-stats">
            <div className="c win">
              <div className="num">+12.3<span className="u">pts</span></div>
              <div className="lbl">Overall accuracy on the held-out set, 37.7% → 50.0%, after fine-tuning on the dataset.</div>
            </div>
            <div className="c win">
              <div className="num">+23.5<span className="u">pts</span></div>
              <div className="lbl">Mathematics, the largest subject gain — accuracy nearly doubled, from 26.5% to 50.0%.</div>
            </div>
            <div className="c">
              <div className="num">22,679</div>
              <div className="lbl">Multimodal science QA pairs across four subjects, every answer with its reasoning.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Reproducibility</p>
            <h2>Everything here is public.</h2>
            <p className="lead">The fine-tuned model and a dataset sample are public, and the held-out questions are the same ones the baseline was scored on.</p>
          </div>
          <div className="s-verify-row">
            <a className="s-btn ghost" href="https://huggingface.co/Nalandadata/nalanda-image-vl" target="_blank" rel="noopener noreferrer">Open the model on Hugging Face →</a>
            <a className="s-btn primary" href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">Download a data sample →</a>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The problem</p>
            <h2>What it takes to read a science diagram.</h2>
            <p className="lead">A large share of science is diagram-dependent. A physics question hinges on a circuit, a maths question on a geometric figure, a chemistry question on a molecular structure. To answer it, a model has to read the diagram correctly first; everything after that depends on getting the picture right.</p>
            <p className="lead">Vision-language models read natural photographs well, and they break on scientific diagrams, because diagrams use a visual vocabulary of their own. A zig-zag line is a resistor, a hexagonal ring is benzene, an arc with a label is an angle. The symbols carry exact meaning, the spatial relationships matter, and a single misread — a subscript, an axis, which line is which — sends the whole answer wrong.</p>
            <p className="lead">What anyone building science tools wants is plain: show the model the diagram and the question, and have it reason from what it sees to the right answer. This is where general models fail. They describe a photograph fluently, but on a circuit or a geometry figure they misread the symbols, lose the spatial detail, or can't connect what they see to the principle that answers the question.</p>
          </div>
          <div className="s-examples">
            <div className="s-ex">
              <div className="subj">Physics · circuit schematic</div>
              <p className="q">A circuit drawn with standard symbols — resistors, a battery, a junction — where the answer depends on which components sit in series and which in parallel.</p>
              <p className="chain"><b>What it takes:</b> recognise each symbol, read the topology, then apply the right law. Misread one symbol and the analysis is wrong from the start.</p>
            </div>
            <div className="s-ex">
              <div className="subj">Mathematics · geometric construction</div>
              <p className="q">A figure with labelled points, angles and lines, where the relationships in the drawing — which segments are equal, which angle is marked — are the problem.</p>
              <p className="chain"><b>What it takes:</b> read the construction precisely and reason from it. The base model often can't see these relationships at all.</p>
            </div>
            <div className="s-ex">
              <div className="subj">Chemistry · molecular structure</div>
              <p className="q">A structure where the bonds, rings and groups define the molecule, and the answer options may themselves be diagrams.</p>
              <p className="chain"><b>What it takes:</b> parse the structure exactly and tell near-identical molecules apart. A small misread changes the compound.</p>
            </div>
          </div>
          <p className="s-closing">What makes these diagrams learnable is the reasoning that goes with them. Every question in the dataset carries a chain-of-thought answer that names the principle and walks from the diagram to the result, so the model learns not just the label but the path to it.</p>
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
              <h4>Diagrams across four sciences</h4>
              <p><b>22,679 multimodal questions</b>, filtered from a pool of 180,505, spanning physics, mathematics, chemistry and biology — circuits, ray diagrams, geometric constructions, function graphs, molecular structures and cell diagrams — in three image roles: question diagrams, solution illustrations and option images.</p>
            </div>
            <div className="s-stp">
              <div className="no">02 · Reason-annotate</div>
              <h4>Chain-of-thought on every answer</h4>
              <p>Each answer carries a full <b>chain-of-thought explanation</b> that identifies the answer, names the underlying principle, and walks from the visual to the result. The model learns the path, not just the label.</p>
            </div>
            <div className="s-stp">
              <div className="no">03 · Fine-tune</div>
              <h4>Train the vision layers, not just the language</h4>
              <p>QLoRA fine-tuning of <b>LLaMA-3.2-Vision-11B</b> in 4-bit, rank 32, on a single A100. The key choice: we train the <b>vision layers</b> as well as the language layers. Most fine-tunes freeze the vision encoder; science diagrams sit too far from natural images for that.</p>
            </div>
            <div className="s-stp">
              <div className="no">04 · Evaluate</div>
              <h4>Held-out, per subject</h4>
              <p><b>162 held-out questions</b> the model never saw, each scored with its diagram, against the same model run zero-shot as the baseline. Broken down by subject, so it is clear where the gains land and where they don't.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The result</p>
            <h2>The gains land where the diagrams are hardest.</h2>
            <p className="lead">All figures are accuracy on the 162-question held-out set: the fine-tuned model against the same LLaMA-3.2-Vision-11B run zero-shot, each question scored with its diagram.</p>
          </div>
          <div className="s-tablecard">
            <div className="s-tbl-scroll">
              <table>
                <caption>Held-out evaluation set (162 questions) · accuracy %, higher is better</caption>
                <thead>
                  <tr>
                    <th scope="col">Subject</th>
                    <th scope="col">Baseline</th>
                    <th scope="col">Nalanda Image VL</th>
                    <th scope="col">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Mathematics</th><td>26.5</td><td>50.0</td><td className="pos">+23.5</td></tr>
                  <tr><th scope="row">Biology</th><td>32.4</td><td>45.9</td><td className="pos">+13.5</td></tr>
                  <tr><th scope="row">Physics</th><td>38.5</td><td>50.0</td><td className="pos">+11.5</td></tr>
                  <tr><th scope="row">Chemistry</th><td>51.3</td><td>53.8</td><td className="pos">+2.6</td></tr>
                  <tr className="best"><th scope="row">Overall</th><td>37.7</td><td>50.0</td><td className="pos">+12.3</td></tr>
                </tbody>
              </table>
            </div>
            <p className="cond"><b>How to read this.</b> The held-out questions come from the same distribution as training, and the model never saw them. The lift concentrates where the base model was weakest: mathematics nearly doubled (+23.5), and biology rose 13.5 points. Chemistry, where the base model was already strongest, gains only modestly (+2.6). The overall gain is +12.3 points.</p>
          </div>
        </div>
      </section>

      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The outcome</p>
            <h2>The model now reads the diagrams it used to misread.</h2>
            <p className="lead">Before fine-tuning, the model failed on science diagrams in specific, recognisable ways. Each is a place where reading the picture breaks down:</p>
          </div>
          <ul className="s-problems">
            <li><b>It misreads the visual vocabulary.</b> A resistor symbol, a benzene ring or a force vector is taken for a generic shape, so the premise is wrong before any reasoning starts.</li>
            <li><b>It loses the precise detail.</b> A subscript, an axis label or which line is which gets read wrong, and a sound method lands on the wrong value.</li>
            <li><b>It can't connect sight to principle.</b> It describes the diagram but doesn't tie what it sees to the law or theorem that answers the question.</li>
            <li><b>It can't tell look-alikes apart.</b> Given near-identical diagrams as options — two molecules, two cell types — it picks the wrong one.</li>
          </ul>
          <p className="s-closing">Fine-tuning on diagram-grounded reasoning fixes these where the diagrams are most distinctive. On the held-out set, overall accuracy rose 12.3 points; mathematics nearly doubled, from 26.5% to 50.0%, and biology climbed 13.5. The biggest gains came in exactly the subjects where the base model was weakest.</p>
          <p className="s-closing">The model and a dataset sample are public. Because the gain came from diagram-grounded questions with reasoning traces, the same recipe carries to any field where the picture is the problem — engineering schematics, medical imaging, technical manuals, charts and graphs.</p>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Reproduce it</p>
            <h2>Run it on your own diagrams.</h2>
            <p className="lead">The fine-tuned model and a dataset sample are public, so the result can be checked on diagrams of your own.</p>
          </div>
          <div className="s-repro">
            <div className="s-repro-links">
              <a className="s-rl" href="https://huggingface.co/Nalandadata/nalanda-image-vl" target="_blank" rel="noopener noreferrer">
                <span className="rk">Model · fine-tuned LLaMA-3.2-Vision-11B</span>Open on Hugging Face →
              </a>
              <a className="s-rl" href="https://huggingface.co/datasets/Nalandadata/nalanda-image-qa" target="_blank" rel="noopener noreferrer">
                <span className="rk">Dataset · public sample</span>Open the dataset →
              </a>
            </div>
            <pre className="s-code">{`from transformers import AutoProcessor, MllamaForConditionalGeneration

repo = "Nalandadata/nalanda-image-vl"
model = MllamaForConditionalGeneration.from_pretrained(repo, device_map="auto")
processor = AutoProcessor.from_pretrained(repo)

msg = [{"role": "user", "content": [
    {"type": "image"},
    {"type": "text", "text": "[Subject: Physics] Solve the circuit. Think step by step."}]}]
prompt = processor.apply_chat_template(msg, add_generation_prompt=True)
inputs = processor(diagram_image, prompt, return_tensors="pt").to(model.device)
print(processor.decode(model.generate(**inputs, max_new_tokens=512)[0],
                       skip_special_tokens=True))`}</pre>
            <p className="s-repro-note">The released checkpoint is the LLaMA-3.2-Vision-11B fine-tune. The held-out result is +12.3 points overall, the number on this page.</p>
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
              <summary>How was the model evaluated?<span className="ic">+</span></summary>
              <div className="ans">On 162 held-out questions the model never saw during training, each scored with its diagram present, against the same LLaMA-3.2-Vision-11B run zero-shot as the baseline. We report accuracy per subject and overall.</div>
            </details>
            <details>
              <summary>Why train the vision layers?<span className="ic">+</span></summary>
              <div className="ans">Because science diagrams are visually unlike the natural images the model was pre-trained on — thin lines, symbols, precise spatial relationships. Freezing the vision encoder, as most fine-tunes do, leaves those representations unchanged. Training the vision layers lets the model adapt what it sees, and it is where the largest gains came from.</div>
            </details>
            <details>
              <summary>Why did Mathematics gain the most?<span className="ic">+</span></summary>
              <div className="ans">Because the base model started weakest there, at 26.5%, and maths diagrams — geometric constructions, function graphs — are among the least like natural images, so there was the most to learn. Accuracy nearly doubled, to 50.0%.</div>
            </details>
            <details>
              <summary>What happened with Chemistry?<span className="ic">+</span></summary>
              <div className="ans">Chemistry gained the least — +2.6 points. The base model was already strongest there, at 51.3%, so there was less headroom than in maths or physics. We report the full per-subject table rather than hide it.</div>
            </details>
            <details>
              <summary>Can we get the data, or data for our own domain?<span className="ic">+</span></summary>
              <div className="ans">Yes. A dataset sample is public, and the curate-annotate-fine-tune pipeline extends to other diagram-heavy domains. Download a sample, or talk to a researcher to scope it.</div>
            </details>
          </div>
        </div>
      </section>

      <section className="s-band s-cs-cta">
        <div className="s-wrap">
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Try it</p>
          <h2 style={{ maxWidth: "26ch", margin: "0 auto", fontSize: "clamp(25px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, textAlign: "center" }}>Want a model that reads your diagrams?</h2>
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
            <Link className="s-rcc" to="/research/drishtitable">
              <div className="res">84.9% TEDS</div>
              <div className="ti">DrishtiTable</div>
              <div className="dm">Table structure recognition · vision-language</div>
              <div className="go">Read the case study →</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
