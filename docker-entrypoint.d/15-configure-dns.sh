#!/bin/sh
set -eu

# Use the container's configured DNS servers, including Docker's embedded DNS.
awk '
    $1 == "nameserver" {
        address = $2
        if (index(address, ":")) address = "[" address "]"
        servers = servers " " address
    }
    END {
        if (servers == "") {
            print "No DNS nameserver configured in /etc/resolv.conf" > "/dev/stderr"
            exit 1
        }
        print "resolver" servers " valid=30s ipv6=off;"
        print "resolver_timeout 5s;"
    }
' /etc/resolv.conf > /etc/nginx/resolver.conf
