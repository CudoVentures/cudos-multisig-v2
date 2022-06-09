#!/bin/bash

protoc \
--plugin="../../node_modules/.bin/protoc-gen-ts_proto" \
--ts_proto_out="./src" \
--proto_path="./proto" \
--proto_path="./proto/third_party" \
--ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=messages,useDate=false" \
"./proto/cosmos/group/types.proto" \
"./proto/cosmos/group/events.proto" \
"./proto/cosmos/group/query.proto" \
"./proto/cosmos/group/tx.proto" \