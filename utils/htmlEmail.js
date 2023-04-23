exports.htmlEmail = (action, url, text, title, subTitle) => {
	if (action === "register") {
		return `<div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 50px 20px;font-size: 110%;">
        <h4 style="text-align:center;">${title}</h4>
        <a href=${url} style="background:#9d174dcc;text-decoration: none;color: white; padding: 10px 20px; margin: 10px 0;display: inline-block">${text}</a>  
        </div>`;
	}
	if (action === "changePassword") {
		return `<div style="max-width: 700px; margin: auto; border: 10px solid #ddd; padding: 50px 20px;font-size: 110%;">
        <h4 style="text-align:center;">${title}</h4>
		<h4 style="text-align:center;">${subTitle}</h4>	
        </div>`;
	}
};
