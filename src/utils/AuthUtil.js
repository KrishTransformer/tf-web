export const parseJwt = (token) => {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);
	return JSON.parse(jsonPayload);
};

export const findCommonElements = (arr1, arr2) => {
	return arr1?.some((item) => arr2?.includes(item));
};

export const trimRoles = (roles) => {
	if (roles instanceof Array) {
		return roles?.map((item) => item.replace("ROLE_", "")) + "";
	} else {
		return roles?.replace("ROLE_", "");
	}
};