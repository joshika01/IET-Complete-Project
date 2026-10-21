import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

const categories = ["Engineering", "Arts & Science", "Medical", "Chennai", "Coimbatore", "Namakkal", "Trichy"];
const features = [
  ["?", "Discover Colleges", "Explore colleges that match your academic interests, preferred location and future goals."],
  ["?", "Compare Courses", "Understand courses, fees, facilities, eligibility and career opportunities before making a decision."],
  ["?", "Get Expert Guidance", "Get support to clarify your doubts and understand the options available to you."],
  ["?", "Make Confident Choices", "Make informed education decisions with clear information and personalized support."],
];
const steps = [
  ["01", "Tell Us What Matters", "Share your interests, academic background, preferred location, goals and budget."],
  ["02", "Explore Your Options", "Discover colleges and courses that align with your preferences."],
  ["03", "Compare and Get Guidance", "Compare available information and ask for help when you need it."],
  ["04", "Move Forward with Confidence", "Use the information and guidance available to make your next decision."],
];
const services = [["?", "Career Guidance", "Understand potential study and career pathways."], ["?", "Course Selection", "Explore courses based on interests and eligibility."], ["?", "College Shortlisting", "Compare suitable institutions and available information."], ["?", "Admission Support", "Understand application steps and document requirements."]];
const questions = [
  ["How can I find a college that suits me?", "Start with your interests, preferred location, academic background and goals. Explore the directory and compare the information available."],
  ["Can I compare different courses?", "Yes. Explore course categories and college listings to review the options currently available in the directory."],
  ["What information should I prepare before counselling?", "It helps to think about your interests, academic results, preferred locations, budget and questions you would like to discuss."],
  ["Can I search for colleges by location?", "Yes. Use the search field or location chips to open college listings for the selected location."],
  ["Does EduPath guarantee admission?", "No. Admission decisions depend on each institutionÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢s eligibility criteria, application process and selection decisions."],
  ["How can I request guidance?", "Use the contact page to submit an admission enquiry. The current form is connected to the project backend."],
];

function Icon({ children }) { return <span className="ep-icon" aria-hidden="true">{children}</span>; }


export default function Home() {
  const [query, setQuery] = useState("");
  const [queryError, setQueryError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();
  function search(value = query) {
    const term = value.trim();
    if (!term) { setQueryError("Enter a course, college or location to search."); return; }
    const category = term.toLowerCase().includes("engineer") ? "Engineering" : term.toLowerCase().includes("medical") ? "Medical" : term.toLowerCase().includes("arts") ? "Arts & Science" : "";
    navigate(category ? `/colleges?course=${encodeURIComponent(category)}` : `/colleges?q=${encodeURIComponent(term)}`);
  }
  function chooseChip(term) { setQuery(term); setQueryError(""); search(term); }
  return <main className="edupath-home">
    <section className="ep-hero" id="home"><div className="ep-hero-copy">
      <div className="ep-eyebrow"><i /> YOUR FUTURE STARTS HERE</div>
      <h1>Find the right college for your <em>future.</em></h1>
      <p className="ep-hero-description">Explore colleges, compare courses, understand your options, and get personalized guidance to make confident education decisions for a brighter tomorrow.</p>
      <div className="ep-actions"><Link className="ep-button ep-button-gold" to="/courses">Explore Courses <span>?</span></Link><Link className="ep-button ep-button-outline" to="/contact">Get Guidance <span>?</span></Link></div>
      <form className="ep-search" onSubmit={e => { e.preventDefault(); search(); }}><span aria-hidden="true">?</span><label className="sr-only" htmlFor="college-search">Search colleges</label><input id="college-search" value={query} onChange={e => { setQuery(e.target.value); setQueryError(""); }} placeholder="Search by course, location or college" /><button aria-label="Search colleges">Search <span>?</span></button></form>
      {queryError && <p className="ep-search-error" role="alert">{queryError}</p>}
      <div className="ep-popular"><span>POPULAR:</span>{categories.map(item => <button key={item} type="button" onClick={() => chooseChip(item)}>{item}</button>)}</div>
    </div><div className="ep-hero-image"><img src="/images/campus-building-1.jpg" alt="University campus building surrounded by green lawns" fetchPriority="high" /><div className="ep-photo-caption"><span>?</span><div><b>Make your next step count</b><small>Explore possibilities with clarity</small></div></div><div className="ep-image-tag">A JOURNEY MADE CLEARER</div></div></section>

    <section className="ep-section ep-why" id="guidance"><div className="ep-section-heading"><span className="ep-kicker">WHY EDUPATH</span><h2>A clearer path to your <em>future.</em></h2><p>Make your college search simpler with the right information and guidance.</p></div><div className="ep-feature-grid">{features.map(([icon,title,desc])=><article className="ep-feature" key={title}><Icon>{icon}</Icon><h3>{title}</h3><p>{desc}</p></article>)}</div></section>

    <section className="ep-process" id="how-it-works"><div className="ep-process-inner"><div className="ep-section-heading ep-light-heading"><span className="ep-kicker">HOW IT WORKS</span><h2>One step at a <em>time.</em></h2><p>College planning can feel overwhelming, but you don't have to do it alone. We're here to guide you through every step of the journey.</p></div><div className="ep-steps">{steps.map(([number,title,desc])=><article className="ep-step" key={number}><span className="ep-step-number">{number}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></div></section>

    <section className="ep-guidance"><div className="ep-guidance-image"><img src="/images/student-counselling.webp" alt="A college student discussing education plans with a campus counsellor" loading="lazy" /></div><div className="ep-guidance-copy"><span className="ep-kicker">PERSONALIZED GUIDANCE</span><h2>Good decisions begin with good <em>conversations.</em></h2><p>Our guidance team can help you understand your options, clarify your questions and plan your next steps toward college.</p><Link className="ep-button ep-button-gold" to="/contact">Request a Conversation <span>?</span></Link><small>Use the existing admission enquiry form to get in touch.</small></div></section>

    <section className="ep-section ep-services"><div className="ep-section-heading"><span className="ep-kicker">HERE WHEN YOU NEED US</span><h2>Guidance for every <em>next step.</em></h2><p>Practical support to help you understand your options and plan what comes next.</p></div><div className="ep-service-grid">{services.map(([icon,title,desc])=><article className="ep-service" key={title}><Icon>{icon}</Icon><h3>{title}</h3><p>{desc}</p></article>)}</div></section>

    <section className="ep-trust"><div className="ep-trust-heading"><span className="ep-kicker">OUR COMMITMENT</span><h2>Information that helps you <em>decide.</em></h2></div><div className="ep-trust-points"><p><b>01</b> Clear college and course information</p><p><b>02</b> Transparent comparison criteria</p><p><b>03</b> Guidance based on your preferences</p><p><b>04</b> Direct contact and support options</p></div></section>

    <section className="ep-section ep-faq" id="faqs"><div className="ep-faq-heading"><span className="ep-kicker">GOOD TO KNOW</span><h2>Your questions, <em>answered.</em></h2><p>Clear information for a more confident college search.</p></div><div className="ep-accordion">{questions.map(([question,answer],index)=><article className={`ep-faq-item ${openFaq===index?"is-open":""}`} key={question}><h3><button aria-expanded={openFaq===index} aria-controls={`faq-answer-${index}`} onClick={()=>setOpenFaq(openFaq===index?-1:index)}>{question}<span aria-hidden="true">{openFaq===index?"-":"+"}</span></button></h3>{openFaq===index&&<p id={`faq-answer-${index}`}>{answer}</p>}</article>)}</div></section>

    <section className="ep-final-cta"><span className="ep-kicker">BETTER GUIDANCE. BRIGHTER FUTURES.</span><h2>Your next chapter starts with the <em>right choice.</em></h2><p>Explore your options and take the next step with confidence.</p><div className="ep-actions"><Link className="ep-button ep-button-gold" to="/courses">Explore Courses <span>?</span></Link><Link className="ep-button ep-button-outline" to="/contact">Get Guidance <span>?</span></Link></div></section>
  </main>;
}





