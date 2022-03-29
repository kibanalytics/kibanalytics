#!/bin/bash

readonly URI_REGEX='^(([^:/?#]+):)?(//((([^:/?#]+)@)?([^:/?#]+)(:([0-9]+))?))?(/([^?#]*))(\?([^#]*))?(#(.*))?'

parse_scheme () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[2]}"
}

parse_authority () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[4]}"
}

parse_user () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[6]}"
}

parse_host () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[7]}"
}

parse_port () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[9]}"
}

parse_path () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[10]}"
}

parse_rpath () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[11]}"
}

parse_query () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[13]}"
}

parse_fragment () {
    [[ "$@" =~ $URI_REGEX ]] && echo "${BASH_REMATCH[15]}"
}

cat <<EOF
input {
EOF

for input in ${REDIS_URIS}; do
  echo "
  redis {
    type => \"tracker\"
    data_type => \"list\"
    key => \"${TRACKING_KEY}\"
    port => \"$(parse_port $input)\"
    host => \"$(parse_host $input)\"
    db => $(parse_path $input | tr -d '/')
    codec => \"json\"
    batch_count => 125
    threads => 1
  }
";
done


cat <<EOF
}

filter {
  if [type] == "tracker" {
    date {
      match => [ "@ts", "UNIX" ]
      target => "@timestamp"
      remove_field => [ "@ts" ]
    }

    useragent {
        source => "ua"
        target => "@agent"
        remove_field => [
            "[@agent][patch]", "[@agent][build]", "[@agent][major]", "[@agent][minor]"
        ]
    }

    if [@agent][name] == "PetalBot" {
        mutate {
            update => { "[@agent][device]" => "Spider" }
        }
    }

  }
}


output {
  if [type] == "tracker" {
    stdout {}

    if [@agent][device] != "Spider" {
EOF
    echo "
        elasticsearch {
          hosts  => [ \"$( echo ${ELASTICSEARCH_URIS} | sed 's/,/", "/g')\" ]
          index  => \"tracker-%{+YYYY.MM.dd}\"
          action => \"create\"
        }
    ";
cat <<EOF
    }
  }
}

EOF