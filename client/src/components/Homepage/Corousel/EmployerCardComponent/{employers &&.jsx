{
  employers &&
    employers.map((employer, i) => {
      return (
        <div key={i}>
          <div className="employer-card">
            <div className="employer-card-img-wrapper">
              <img
                className="employer-card-img-wrapper__img"
                src={`${REACT_APP_STATIC_IMAGE_PATH}/${employer.image}`}
                alt="logo"
              />
            </div>
            <h3 className="employer-card__title">
              {employer.userName || employer.companyName || 'Employer'}
            </h3>
            <p className="employer-card__location">
              {employer.companyAddress || 'Nepal'}
            </p>
          </div>
        </div>
      );
    });
}
