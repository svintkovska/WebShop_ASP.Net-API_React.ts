import { useTranslation } from 'react-i18next';

const Footer = () =>{
  const { t } = useTranslation();

    return (
      <>
        <section className="info_section  layout_padding2-top">
          <div className="social_container">
            <div className="social_box">
              <a href="">
                <i className="fa fa-facebook" aria-hidden="true"></i>
              </a>
              <a href="">
                <i className="fa fa-twitter" aria-hidden="true"></i>
              </a>
              <a href="">
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="">
                <i className="fa fa-youtube" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          <div className="info_container ">
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <h6>{t('footer.aboutUs')}</h6>
                  <p>
                  {t('footer.aboutUsText')}
                  </p>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="info_form ">
                    <h5>{t('footer.newsletter')}</h5>
                    <form action="#">
                      <input type="email" placeholder={t('footer.enterEmail')} />
                      <button>{t('footer.subscribe')}</button>
                    </form>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <h6>{t('footer.help')}</h6>
                  <p>
                  {t('footer.helpText')}
                  </p>
                </div>
                <div className="col-md-6 col-lg-3">
                  <h6>{t('footer.conactUs')}</h6>
                  <div className="info_link-box">
                    <a href="">
                      <i className="fa fa-map-marker" aria-hidden="true"></i>
                      <span> {t('footer.address')} </span>
                    </a>
                    <a href="">
                      <i className="fa fa-phone" aria-hidden="true"></i>
                      <span>+01 12345678901</span>
                    </a>
                    <a href="">
                      <i className="fa fa-envelope" aria-hidden="true"></i>
                      <span> demo@gmail.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className=" footer_section">
            <div className="container">
              <p>
                &copy; <span id="displayYear">2023 </span>{t('footer.rights')}
              </p>
            </div>
          </footer>
        </section>
      </>
    );
}

export default Footer;