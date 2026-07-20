import PageHero from "../components/PageHero";

export default function About() {
  return (
    <main>
      <PageHero
        eyebrow="ABOUT JUMP BANK"
        title="Banking software built around clarity."
        text="Jump Bank is an educational full-stack banking application that connects a React interface to a Spring Boot REST API and MongoDB."
      />

      <section className="content-section">
        <div className="page-width split-section">
          <div>
            <p className="eyebrow">OUR PURPOSE</p>
            <h2 className="large-heading">
              Make account management straightforward.
            </h2>
          </div>
          <div className="prose">
            <p>
              The application is designed to demonstrate the complete flow of a
              modern full-stack system. Customers interact with a responsive
              website, React sends requests to the REST API, Spring Boot applies
              the banking logic, and MongoDB stores the resulting account data.
            </p>
            <p>
              The public pages introduce the service, while authenticated
              customers receive access to balances, deposits, withdrawals, and
              transfer tools. Administrators receive a separate customer
              management experience.
            </p>
          </div>
        </div>
      </section>

      <section className="light-section">
        <div className="page-width three-column value-cards">
          <article>
            <h3>Clear</h3>
            <p>Interfaces prioritize account information and important actions.</p>
          </article>
          <article>
            <h3>Connected</h3>
            <p>Frontend actions map directly to Spring Boot REST endpoints.</p>
          </article>
          <article>
            <h3>Maintainable</h3>
            <p>Pages, components, API logic, and models remain separated.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
