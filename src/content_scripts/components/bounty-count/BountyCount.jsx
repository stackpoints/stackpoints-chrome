import { abi as stackpointContract } from "../../abis/StackPointClaim.json";
import contractConfig from "../../configs/contracts.json";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";
import { readContract } from "@wagmi/core";
import { formatEther, encodePacked, keccak256 } from "viem";

// Custom hook for fetching bounty data
const useBountyData = (wagmiConfig, objType, objId, siteId, refreshInterval = 5000) => {
  const [bountyCount, setBountyCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getBountyParams = useCallback(() => {
    return keccak256(
      encodePacked(
        ["string"], 
        [`${objType}-${objId}-${siteId}`]
      )
    );
  }, [objType, objId, siteId]);

  const fetchCount = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = getBountyParams();
      
      const result = await readContract(wagmiConfig, {
        abi: stackpointContract,
        address: contractConfig.CONTRACT_ADDRESS,
        functionName: "getBounty",
        args: [params],
      });

      setBountyCount(result ? formatEther(result.totalAmount) : 0);
    } catch (error) {
      console.error('Error fetching bounty count:', error);
      setBountyCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [wagmiConfig, getBountyParams]);

  useEffect(() => {
    fetchCount();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchCount, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchCount, refreshInterval]);

  return { bountyCount, isLoading };
};

// Loading spinner component
const LoadingSpinner = () => (
  <span className="loading-spinner" aria-label="Loading bounty count" />
);

// Bounty display component
const BountyDisplay = ({ value }) => (
  <span className="bounty-value">{value}</span>
);

BountyDisplay.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

function BountyCount({ wagmiConfig, objId, objType, siteId }) {
  const { bountyCount, isLoading } = useBountyData(
    wagmiConfig, 
    objType, 
    objId, 
    siteId
  );

  return (
    <div className="bounty-count-container">
      <p className="flex--item d-flex fd-column ai-center fw-bold py4 fc-theme-secondary">
        {isLoading ? <LoadingSpinner /> : <BountyDisplay value={bountyCount} />}
      </p>
    </div>
  );
}

BountyCount.propTypes = {
  wagmiConfig: PropTypes.shape({
    // Add specific wagmiConfig shape requirements
    contracts: PropTypes.array,
    config: PropTypes.object,
  }).isRequired,
  objId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  objType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  siteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default BountyCount;
