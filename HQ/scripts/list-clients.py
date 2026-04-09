#!/usr/bin/env python3
import json, sys

path = "/Users/Daito/repos/ZeroEn/HQ/crm/clients.json"
try:
    with open(path) as f:
        d = json.load(f)
    ids = [c["clientId"] for c in d.get("clients", [])]
    print(", ".join(ids) if ids else "none yet")
except Exception:
    print("none yet")
