import { HolochainPlayground } from "./elements/holochain-playground";
import { ConductorDetail } from "./elements/conductor-detail";
import { SourceChain } from "./elements/source-chain";
import { DHTShard } from "./elements/dht-shard";
import { CreateEntries } from "./elements/create-entries";
import { DHTGraph } from "./elements/dht-graph";
import { BlackboardContainer } from "./blackboard/blackboard-container";

customElements.define("blackboard-container", BlackboardContainer);
customElements.define("holochain-playground", HolochainPlayground);
customElements.define("dht-graph", DHTGraph);
customElements.define("conductor-detail", ConductorDetail);
customElements.define("source-chain", SourceChain);
customElements.define("dht-shard", DHTShard);
customElements.define("create-entries", CreateEntries);
