CREATE TABLE my_users (
	user_id varchar(30) PRIMARY KEY,
	invitation_code varchar(30) not null,
	password varchar(30) not null,
	private_matches json,
	is_logged boolean default false not null
);

CREATE TABLE my_invitation_codes (
	invitation_code varchar(30) PRIMARY KEY,
	users json,
	max_users int not null,
	current_users int not null
);

--CREATE TABLE my_dem_files (
--	match_id bigint PRIMARY KEY,
--	owner_user_id varchar(30),
--	is_public boolean not null
--);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
   
