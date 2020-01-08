package com.neusoft.hms.webapp.common.bean;

public class UserNameAndEmail {
	
    private String name;
    
    private String email;
    
    public UserNameAndEmail(String name, String email) {
        this.name = name;
        this.email = email;
    }

	public String getEmail() {
		return email;
	}

	public String getName() {
		return name;
	}

}
