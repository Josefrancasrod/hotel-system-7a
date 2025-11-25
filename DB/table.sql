-- Crear tabla de usuarios
create table if not exists users (
    id bigserial primary key,           -- ID único autoincremental
    nombre varchar(100) not null,       -- Nombre
    apellidos varchar(150) not null,    -- Apellidos
    email varchar(150) not null unique, -- Email único
    username varchar(50) not null unique, -- Nombre de usuario único
    cell_number varchar(20),            -- Número celular opcional
    password varchar(255) not null,     -- Contraseña hasheada
    role varchar(20) default 'user',    -- Rol (user/admin)
    created_at timestamptz default now(), -- Fecha de creación
    updated_at timestamptz default now()  -- Fecha de actualización
);
