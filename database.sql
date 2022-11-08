create table workers(
	id serial not null primary key,
    username text not null,
    code varchar
);
create table workdays(
	id serial not null primary key,
    workday text not null
);
create table admins(
    id serial not null primary key,
    user_id integer,
    FOREIGN KEY (user_id) references workers(id),
    day_id integer
    FOREIGN KEY (day_id) references workdays(id)
);
INSERT INTO workdays(workday) values ('Monday'), ('Tuesday'), ('Wednesday'), ('Thursday'), ('Friday'), ('Saturday'), ('Sunday');

INSERT INTO workers(username) values('Mxolisi');