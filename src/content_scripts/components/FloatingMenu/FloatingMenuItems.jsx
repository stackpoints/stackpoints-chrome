import { Coins, History, Award } from "lucide-react";
import PropTypes from "prop-types";
import ModalButton from "../modal-button/ModalButton";
import {appUrl} from "../../configs/configs";

const MENU_ITEM_CLASSES = `
  flex items-center gap-2 
  px-4 py-2 
  bg-white 
  rounded-lg shadow-md 
  text-so-gray-700 
  hover:bg-so-gray-50 
  transition-colors duration-150 
  min-w-[160px] 
  group
`;

const MENU_ITEMS = [
  {
    id: "bounty-history",
    icon: <Award className="w-5 h-5" />,
    label: "Bounty History",
    modalTitle: "Bounty History",
    frameUrl: `${appUrl}/bountyHistory`,
  },
  {
    id: "reward-history",
    icon: <History className="w-5 h-5" />,
    label: "Reward History",
    modalTitle: "Reward History",
    frameUrl: `${appUrl}/rewardHistory`,
  },
  {
    id: "claim",
    icon: <Coins className="w-5 h-5" />,
    label: "Claim",
    modalTitle: "Claim",
    frameUrl: `${appUrl}/claim`,
  },
];

const MenuItem = ({ item, onClose }) => (
  <ModalButton
    btnChildren={
      <MenuItemContent icon={item.icon} label={item.label} />
    }
    classes={MENU_ITEM_CLASSES}
    frameUrl={`${item.frameUrl}`}
    modalTitle={item.modalTitle}
    onClick={onClose}
  />
);

MenuItem.propTypes = {
  item: PropTypes.shape({
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,  
    modalTitle: PropTypes.string.isRequired,
    frameUrl: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

const MenuItemContent = ({ icon, label }) => (
  <span className="flex items-center gap-2">
    <span className="text-so-orange group-hover:text-orange-500">
      {icon}
    </span>
    <span className="font-medium">{label}</span>
  </span>
);

MenuItemContent.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

export function FloatingMenuItems({ onClose }) {
  return (
    <div className="absolute bottom-16 right-0 mb-4" role="menu">
      <div className="flex flex-col-reverse gap-3">
        {MENU_ITEMS.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}

FloatingMenuItems.propTypes = {
  onClose: PropTypes.func.isRequired
};

