backend node {
    .host = "node";
    .port = "3000";
    .connect_timeout = 3s;
    .first_byte_timeout = 10s;
    .between_bytes_timeout = 1s;
}

sub vcl_init {
    new be_web = directors.round_robin();
    be_web.add_backend(node);
}

sub host_to_backend_hinting {
    set req.backend_hint = be_web.backend();
}