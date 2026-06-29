import { Link } from "react-router-dom";

export default function NalandaBenchPage() {
  return (
    <div className="bg-[#0A0A0A]" style={{ paddingTop: "96px" }}>
      <section className="s-pagehead">
        <div className="s-wrap">
          <nav className="s-crumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link> / NalandaBench
          </nav>
        </div>
      </section>

      <section className="s-cs-hero">
        <div className="s-wrap">
          <p className="s-eyebrow">Case study · Science &amp; maths reasoning</p>
          <h1>Teaching a small model to reason through <span className="hl">advanced science and maths problems</span>.</h1>
          <p className="s-cs-deck">
            We wanted a small, cheap model — <b>Qwen 2.5 7B</b> — to solve <b>advanced science and maths problems</b>,
            the kind that take several steps of reasoning rather than a single recalled fact. Our material was{" "}
            <b>116,831 expert solutions</b> from JEE and NEET, India's toughest university-entrance exams, each with a
            verified correct answer. Trained on them the usual way, the model got <b>worse</b>. So we used the verified
            answers as a reward instead: scoring the model on whether it reached the right answer, which pushed it to
            reason its way there rather than memorise. That lifted it <b>6.3 points</b>, from 60.5% to 66.8%, on a
            held-out set of 800 questions. The model, the data and the test set are all public.
          </p>
          <div className="s-metastrip">
            <div><div className="mk">Method</div><div className="mv">Verified-reward RL (GRPO)</div></div>
            <div><div className="mk">Domain</div><div className="mv">Science &amp; maths reasoning · JEE/NEET</div></div>
            <div><div className="mk">Base model</div><div className="mv">Qwen 2.5 7B Instruct</div></div>
            <div><div className="mk">Evaluation</div><div className="mv">800 held-out MCQs (NalandaBench)</div></div>
          </div>
          <div className="s-cs-stats">
            <div className="c warn">
              <div className="num">−16.4<span className="u">pts</span></div>
              <div className="lbl">What standard supervised fine-tuning did to overall accuracy on the held-out set. The same data, the wrong method.</div>
            </div>
            <div className="c win">
              <div className="num">+6.3<span className="u">pts</span></div>
              <div className="lbl">The two-stage verified-reward model — one downloadable checkpoint, 60.5% → 66.8% on the held-out set.</div>
            </div>
            <div className="c win">
              <div className="num">2.5×</div>
              <div className="lbl">The lift from correcting mislabelled data alone, with no change to the method.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Reproducibility</p>
            <h2>Everything here is public.</h2>
            <p className="lead">The fine-tuned model and a data sample are public, including the held-out set the +6.3 is measured on.</p>
          </div>
          <div className="s-verify-row">
            <a className="s-btn ghost" href="https://huggingface.co/Nalandadata/nalanda-qwen-7b-grpo" target="_blank" rel="noopener noreferrer">Open the model on Hugging Face →</a>
            <a className="s-btn primary" href="https://huggingface.co/datasets/Nalandadata/NalandaJEENEETBench" target="_blank" rel="noopener noreferrer">Download a data sample →</a>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The problem</p>
            <h2>What it takes to solve one of these problems.</h2>
            <p className="lead">Maths and science are the hardest test of whether a model can reason. Every problem has one correct answer, reached through a chain of steps, that the model either gets or it doesn't. That makes a hard exam a clean way to measure what a model can really do, and what it takes to improve it.</p>
            <p className="lead">We chose JEE and NEET because they are about as hard as competitive reasoning gets. JEE is the entrance exam for the IITs, and JEE Advanced is widely regarded as one of the toughest exams in the world. Around 1.5 million students sit JEE every year; only the top 250,000 even qualify to attempt the Advanced paper, about 54,000 clear it, and the IITs have roughly 18,000 seats. Of everyone who sits the exam, only about one in eighty ends up in an IIT. NEET, the gateway to medical school, draws over two million more each year. These exams are built so that memorisation and pattern-matching don't pass: a single question folds two or three concepts into one chain. A model that does well on them is reasoning, not recalling.</p>
            <p className="lead">What a lab training a reasoning model wants is straightforward: a model that can read a hard science or maths problem and work through to the answer. This is where models fail. They know the individual facts, but on a multi-step problem they break somewhere in the chain and produce a clean, confident solution that reaches the wrong number. There is no partial credit; the answer is right or wrong. Here is the kind of problem we mean.</p>
          </div>
          <div className="s-examples">
            <div className="s-ex">
              <div className="subj">Physics · mechanics</div>
              <p className="q">A block slides down a frictionless incline of height h and sticks to an identical block resting at the bottom. Find their speed just after the collision.</p>
              <p className="chain"><b>What it takes:</b> energy conservation to find the speed at the foot of the incline, then momentum conservation for the inelastic collision. Two principles, in order, in one question.</p>
            </div>
            <div className="s-ex">
              <div className="subj">Chemistry · stoichiometry</div>
              <p className="q">What mass of oxygen is needed to completely combust 16 g of methane?</p>
              <p className="chain"><b>What it takes:</b> balance CH4 + 2O2 → CO2 + 2H2O, convert grams to moles, apply the 1:2 ratio, convert back to grams. Mis-balance the first line and everything after it is wrong.</p>
            </div>
            <div className="s-ex">
              <div className="subj">Mathematics · calculus</div>
              <p className="q">Find the local maximum value of f(x) = x³ − 3x.</p>
              <p className="chain"><b>What it takes:</b> differentiate, solve f′(x) = 0 for the critical points, use the second derivative to tell a maximum from a minimum, then evaluate. Skip the test and you report the wrong point.</p>
            </div>
          </div>
          <p className="s-closing">What makes these exams useful to us is that every question has one verified answer, with an expert worked solution behind it. That is what turns a hard test into training data, and it is where our method begins.</p>
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
              <div className="no">01 · Audit</div>
              <h4>Clean the archive before training</h4>
              <p>128,832 raw questions. A keyword audit found <b>39.4% carried the wrong subject label</b> — Biology was 73.7% mislabelled — and 12,001 were non-STEM. Cleaning left <b>116,831</b> correctly labelled questions. This step alone, with no change to the method, lifted the eventual gain from +2.5 to +6.3 points.</p>
            </div>
            <div className="s-stp">
              <div className="no">02 · Light SFT</div>
              <h4>A short pass, with general data mixed in</h4>
              <p>200 steps on a <b>70/30 mix of domain and general data</b> (SlimOrca), with NEFTune noise and a conservative LoRA setup (rank 8, attention-only). An aggressive setup — rank 32, all-linear targets — was what caused the 16-point collapse.</p>
            </div>
            <div className="s-stp">
              <div className="no">03 · Verified-reward RL</div>
              <h4>GRPO on correct answers</h4>
              <p>The model samples <b>eight answers per question</b> and is rewarded for reaching the verified-correct one, with smaller rewards for structure and reasoning. 600 steps on 10,000 multiple-choice questions.</p>
            </div>
            <div className="s-stp">
              <div className="no">04 · Evaluate</div>
              <h4>Held-out, plus public benchmarks</h4>
              <p>800 held-out MCQs, 200 per subject, released as <b>NalandaBench</b>. GSM8K, MMLU and ARC run alongside, to confirm general reasoning survived the specialisation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The result</p>
            <h2>Standard fine-tuning made the model worse. Verified-reward RL improved it.</h2>
            <p className="lead">All figures are on the 800-question held-out set, against the Qwen 2.5 7B baseline. The verified-reward column is the single clean-data GRPO model — the one you can download.</p>
          </div>
          <div className="s-tablecard">
            <div className="s-tbl-scroll">
              <table style={{ minWidth: "360px" }}>
                <caption>Held-out evaluation set (800 MCQs) · accuracy %, higher is better</caption>
                <thead>
                  <tr>
                    <th scope="col">Subject</th>
                    <th scope="col">Base</th>
                    <th scope="col">SFT</th>
                    <th scope="col">GRPO ↑</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Physics</th><td>51.0</td><td className="neg">34.5</td><td className="pos">62.0</td></tr>
                  <tr><th scope="row">Chemistry</th><td>61.5</td><td className="neg">50.0</td><td className="pos">71.5</td></tr>
                  <tr><th scope="row">Mathematics</th><td>56.0</td><td className="neg">40.5</td><td>56.0</td></tr>
                  <tr><th scope="row">Biology</th><td>73.5</td><td className="neg">51.5</td><td className="pos">77.5</td></tr>
                  <tr className="best"><th scope="row">Overall</th><td>60.5</td><td>44.1</td><td>66.8</td></tr>
                </tbody>
              </table>
            </div>
            <p className="cond"><b>How to read this.</b> One representative model per column. Standard SFT (the aggressive variant) degraded every subject — overall −16.4. The verified-reward RL column is the clean-data GRPO model, <b>+6.3 overall</b>, and it is the checkpoint you can download and reproduce.</p>
          </div>
        </div>
      </section>

      <section className="s-band alt">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">General capability</p>
            <h2>What it did to general reasoning.</h2>
            <p className="lead">Mostly preserved or improved — with two regressions we report in full rather than hide.</p>
          </div>
          <div className="s-tablecard">
            <div className="s-tbl-scroll">
              <table style={{ minWidth: "360px" }}>
                <caption>Public benchmarks · baseline vs the verified-reward model · accuracy %</caption>
                <thead>
                  <tr>
                    <th scope="col">Benchmark</th>
                    <th scope="col">Base</th>
                    <th scope="col">GRPO</th>
                    <th scope="col">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row">GSM8K (math reasoning)</th><td>94.7</td><td>96.0</td><td className="pos">+1.3</td></tr>
                  <tr><th scope="row">ARC-Challenge (science)</th><td>90.0</td><td>90.0</td><td>0.0</td></tr>
                  <tr><th scope="row">MMLU-Physics</th><td>81.1</td><td>83.8</td><td className="pos">+2.7</td></tr>
                  <tr><th scope="row">MMLU-Chemistry</th><td>62.0</td><td>68.0</td><td className="pos">+6.0</td></tr>
                  <tr><th scope="row">MMLU-Mathematics</th><td>63.5</td><td>53.8</td><td className="neg">−9.7</td></tr>
                  <tr><th scope="row">MMLU-Biology</th><td>88.5</td><td>82.0</td><td className="neg">−6.5</td></tr>
                </tbody>
              </table>
            </div>
            <p className="cond"><b>Honest read.</b> General reasoning held or improved on four of six. The two regressions — MMLU-Mathematics and MMLU-Biology — come from the subject-balanced variant, where pushing Physics trades against other subjects. We show the whole table.</p>
          </div>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">The outcome</p>
            <h2>The model now reasons through problems it used to get wrong.</h2>
            <p className="lead">Before fine-tuning, the model failed in specific, recognisable ways. Each is a place where a chain of reasoning breaks:</p>
          </div>
          <ul className="s-problems">
            <li><b>Wrong principle, wrong from step one.</b> It reaches for the wrong law to begin with (kinematics where energy conservation is needed), and nothing downstream can recover.</li>
            <li><b>A dropped step.</b> It skips a link in a multi-step derivation and lands on an answer that looks complete but isn't.</li>
            <li><b>An arithmetic or algebra slip.</b> One manipulation error mid-chain carries straight through to the wrong final number.</li>
            <li><b>Elimination instead of solving.</b> It picks the most plausible-looking option rather than working the problem, which holds up on easy items but collapses on multi-concept ones.</li>
            <li><b>Solution-shaped, still wrong.</b> It produces a fluent, well-structured derivation that still lands on the wrong answer.</li>
          </ul>
          <p className="s-closing">Verified-reward RL targets every one of these directly, because it rewards a single thing: reaching the correct answer. On the held-out set the model improved by 6.3 points overall, and the gains are largest exactly where the reasoning is hardest: physics up 11 points and chemistry up 10.</p>
          <p className="s-closing">The model is public, with a live demo to put your own problem to it. Because the gain came from verified answers and the right method, the same approach carries to any domain where the answers can be checked — a curriculum, a body of case law, a set of internal manuals.</p>
        </div>
      </section>

      <section className="s-band">
        <div className="s-wrap">
          <div className="s-sec-head">
            <p className="s-eyebrow">Reproduce it</p>
            <h2>Run the model. Or try it in your browser.</h2>
            <p className="lead">The model and the held-out set are public, so the result can be checked on your own inputs.</p>
          </div>
          <div className="s-repro" style={{ marginTop: "24px" }}>
            <div className="s-repro-links">
              <a className="s-rl" href="https://huggingface.co/Nalandadata/nalanda-qwen-7b-grpo" target="_blank" rel="noopener noreferrer">
                <span className="rk">Model · GRPO checkpoint</span>Open on Hugging Face →
              </a>
              <a className="s-rl" href="https://huggingface.co/datasets/Nalandadata/NalandaJEENEETBench" target="_blank" rel="noopener noreferrer">
                <span className="rk">NalandaBench · 800 held-out MCQs</span>Open the evaluation set →
              </a>
            </div>
            <pre className="s-code">{`from transformers import AutoModelForCausalLM, AutoTokenizer

repo = "Nalandadata/nalanda-qwen-7b-grpo"
model = AutoModelForCausalLM.from_pretrained(repo, device_map="auto")
tok   = AutoTokenizer.from_pretrained(repo)

msg = [{"role": "user", "content": "<JEE/NEET MCQ>  Think step by step, then answer A-D."}]
ids = tok.apply_chat_template(msg, add_generation_prompt=True, return_tensors="pt").to(model.device)
print(tok.decode(model.generate(ids, max_new_tokens=512)[0], skip_special_tokens=True))`}</pre>
            <p className="s-repro-note">The released checkpoint is the clean-data GRPO model — +6.3 overall on the held-out set, the number on this page.</p>
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
              <summary>Why did standard fine-tuning fail?<span className="ic">+</span></summary>
              <div className="ans">Catastrophic forgetting. An aggressive LoRA setup trained on 100% domain data overwrote the model's general reasoning, dropping accuracy 16 points below baseline. A conservative LoRA setup, a 30% general-data mix, and rewarding correct answers with RL rather than imitating solution text is what avoided it.</div>
            </details>
            <details>
              <summary>What was the single biggest lever?<span className="ic">+</span></summary>
              <div className="ans">Data quality. Auditing and correcting the mislabelled subject tags — with no change to the model, hyperparameters or compute — more than doubled the gain, from +2.5 to +6.3 points. Biology, the most contaminated subject at 73.7%, swung from a regression to a genuine improvement.</div>
            </details>
            <details>
              <summary>Which number does the downloadable model give?<span className="ic">+</span></summary>
              <div className="ans">+6.3 overall (60.5% → 66.8%) on the held-out set, against the Qwen 2.5 7B baseline. That is the clean-data GRPO model. A subject-balanced variant reaches +14 in Physics by trading some Mathematics; we headline the single reproducible model because it is the one you can verify.</div>
            </details>
            <details>
              <summary>Did specialising hurt general ability?<span className="ic">+</span></summary>
              <div className="ans">Mostly no. GSM8K, MMLU-Physics and MMLU-Chemistry improved and ARC held flat. Two benchmarks regressed under the subject-balanced variant, MMLU-Mathematics and MMLU-Biology. The full table is on this page.</div>
            </details>
            <details>
              <summary>Can we get the data?<span className="ic">+</span></summary>
              <div className="ans">The 800-question NalandaBench evaluation set is public, and a dataset sample is available. The full verified-solution corpus is licensed — download a sample or talk to a researcher to scope a slice for your domain.</div>
            </details>
          </div>
        </div>
      </section>

      <section className="s-band s-cs-cta">
        <div className="s-wrap">
          <p className="s-eyebrow" style={{ justifyContent: "center" }}>Try it</p>
          <h2 style={{ maxWidth: "22ch", margin: "0 auto", fontSize: "clamp(25px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.08, textAlign: "center" }}>Want verified-reward results on your domain?</h2>
          <div className="s-cta-row">
            <Link className="s-btn primary" to="/#connect">Download a sample</Link>
            <Link className="s-btn ghost" to="/#connect">Talk to a researcher</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
