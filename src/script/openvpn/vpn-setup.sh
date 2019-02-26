#!/bin/bash

# Enable IP Forwarding
sed -i 's/net.ipv4.ip_forward = 0/net.ipv4.ip_forward = 1/' /etc/sysctl.conf
sysctl net.ipv4.ip_forward=1

# Enable NATting of VPN traffic
/sbin/iptables -t nat -A POSTROUTING -s {{vpn_subnet}} -o eth0 -j MASQUERADE
