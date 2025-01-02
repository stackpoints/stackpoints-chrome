import ModalButton from "./components/modal-button/ModalButton";
import BountyCount from "./components/bounty-count/BountyCount";
import DisabledTrophy from "./components/extras/DisabledTrophy";
import { createRoot } from "react-dom/client";
import { http, createConfig, readContract } from "@wagmi/core";
import { baseSepolia } from "@wagmi/core/chains";
import { encodePacked, keccak256 } from "viem";
import { Trophy } from "lucide-react";

import storage from "../utils/chromeStorage";  
import { appUrl, getSitesData, getContentTypes, getRpcNode, setRpcNode } from "./configs/configs";

import { FloatingButton } from "./components/FloatingMenu/FloatingButton";

import '../index.css'
import { abi as stackpointContract } from "./abis/StackPointClaim.json";
import contractConfig from "./configs/contracts.json";
import Tooltip from "./components/extras/Tooltip";
// Component for bounty button and count
const BountyContainer = ({
  wagmiConfig,
  objType,
  postId,
  siteId,
  canShowButton,
  appUrl,
}) => (
  <div>   
    <Tooltip content={!canShowButton ? "Bounty period  expired." : "Place Bounty"} position="right">
    <ModalButton
      classes="s-btn s-btn__unset c-pointer py4 fc-orange-400"
      btnChildren={canShowButton ? <Trophy /> : <DisabledTrophy />}
      frameUrl={`${appUrl}/bounty?bounty_code=${objType}-${postId}-${parseInt(
        siteId
      )}`}
      modalTitle="Place Bounty"
      disabled={!canShowButton}
    />
    </Tooltip>

    <Tooltip content={"Total Bounty"} position="right">
    <BountyCount
      wagmiConfig={wagmiConfig}
      objType={objType}
      objId={postId}
      siteId={siteId}
    />
    </Tooltip>
  </div>
);

// Check if bounty should be rendered
async function shouldRenderModalButton(wagmiConfig, objType, objId, siteId) {
  try {
    const params = keccak256(
      encodePacked(["string"], [`${objType}-${objId}-${siteId}`])
    );
    const bountyData = await readContract(wagmiConfig, {
      address: contractConfig.CONTRACT_ADDRESS,
      abi: stackpointContract,
      functionName: 'getBounty',
      args: [params],
    });
    
    const now = Math.floor(Date.now() / 1000);
    return bountyData && bountyData.endtime != 0 && bountyData.endtime <= now
      ? false
      : true;
  } catch (error) {
    console.error('Error checking bounty:', error);
    alert("Error checking bounty: " + error);
    return true;
  }
}

// Initialize wagmi configuration
function initializeWagmiConfig(rpcNode) {
  return createConfig({
    chains: [baseSepolia],
    multiInjectedProviderDiscovery: false,
    transports: {
      [baseSepolia.id]: http(rpcNode),
    },
  });
}

// Render bounty buttons for a specific type (question/answer)
async function renderBountyButtons(selector, objType, wagmiConfig, siteData) {
  document.querySelectorAll(selector).forEach(async (ele) => {
    const domNode = document.createElement("div");
    const root = createRoot(domNode);
    const objId = objType == 1 ?  ele.dataset.questionid +":0" :ele.dataset.parentid+":"+ele.dataset.answerid;
    const canShowButton = await shouldRenderModalButton(wagmiConfig, objType,objId , siteData.id);
    const container = ele.querySelector(".js-voting-container");
    root.render(
      <BountyContainer
        wagmiConfig={wagmiConfig}
        objType={objType}
        postId={objId}
        siteId={siteData.id}
        canShowButton={canShowButton}
        appUrl={appUrl}
      />
    );
    container.appendChild(domNode);
  });
}

// Main UI loading function
function loadUI() {
  
  const wagmiConfig = initializeWagmiConfig(getRpcNode());
  const domainURL = new URL(window.location.href).origin;
  const siteData = getSitesData()[domainURL];

  if (!siteData) {
    console.error("Unable to get siteData");
    return;
  }

  // Add floating button
  const floatingButtonNode = document.createElement("div");
  const floatingButtonRoot = createRoot(floatingButtonNode);
  floatingButtonRoot.render(<FloatingButton />);
  const container = document.getElementsByClassName("container")[0];
  container.appendChild(floatingButtonNode);

  // Render bounty buttons for questions and answers
  renderBountyButtons(
    "div.question", 
    getContentTypes()["q"], 
    wagmiConfig, 
    siteData
  );
  
  renderBountyButtons(
    "div.answer", 
    getContentTypes()["a"], 
    wagmiConfig, 
    siteData
  );
}

// Initialize storage and UI
function loadStorageAndUI() {
  storage.local.get(["ethRpcUrl"], (result) => {
    if (result.ethRpcUrl) {
      setRpcNode(result.ethRpcUrl);
    }
    loadUI();
  });
}

// Chrome message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.ethRpcUrl) {
    storage.local.set({ ethRpcUrl: request.ethRpcUrl });
    sendResponse("Update Successfully");
  }
});

// Initial load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadStorageAndUI);
} else {
  loadStorageAndUI();
}
