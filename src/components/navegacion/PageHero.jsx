import { Row, Col } from "react-bootstrap";

const PageHero = ({
  kicker,
  title,
  subtitle,
  action,
  aside,
  className = "",
}) => (
  <section className={`view-hero animate-fade-left ${className}`.trim()}>
    <div className="view-hero-orbs" aria-hidden="true">
      <div className="view-hero-orb view-hero-orb-1" />
      <div className="view-hero-orb view-hero-orb-2" />
    </div>
    <Row className="align-items-center g-4 view-hero-inner">
      <Col lg={action || aside ? 8 : 12}>
        {kicker && <span className="view-hero-kicker">{kicker}</span>}
        <h1 className="view-hero-title">{title}</h1>
        {subtitle && <p className="view-hero-subtitle mb-0">{subtitle}</p>}
      </Col>
      {aside && (
        <Col lg={4} className="d-none d-lg-flex justify-content-center view-hero-aside">
          {aside}
        </Col>
      )}
      {action && (
        <Col
          lg={aside ? 12 : 4}
          className={aside ? "text-center text-lg-start mt-2" : "text-lg-end text-center mt-3 mt-lg-0"}
        >
          {action}
        </Col>
      )}
    </Row>
  </section>
);

export default PageHero;
