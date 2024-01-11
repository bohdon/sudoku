import { NetConnectionStatus, NetState } from "../utils/online";

interface NetStatusProps {
  netState: NetState;
}

export default function NetStatus({ netState }: NetStatusProps) {
  function cssClassForStatus(status: NetConnectionStatus): string {
    if (status == "offline") {
      return "";
    } else if (status == "connecting") {
      return "info";
    } else if (status == "error") {
      return "error";
    }
    return "";
  }

  const className = netState;
  return (
    <>
      <div className="box">
        <span
          className={`net-status badge ${cssClassForStatus(netState.status)}`}
        >
          {netState.status}
        </span>
      </div>
    </>
  );
}
