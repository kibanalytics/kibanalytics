backend backend_node_0 {
    .host = "kibanalytics.node";
    .port = "3000";
    .connect_timeout = 3s;
    .first_byte_timeout = 10s;
    .between_bytes_timeout = 1s;
#     .probe = {
#         .url = "/core/vitals/check";
#         .timeout = 3s;
#         .interval = 25s;
#         .window = 1;
#         .threshold = 1;
#         .expected_response = 200;
#     }
    
}
sub vcl_init {

    new be_web = directors.round_robin();
    be_web.add_backend(backend_node_0);
}

sub host_to_backend_hinting {
    set req.backend_hint = be_web.backend();
}
