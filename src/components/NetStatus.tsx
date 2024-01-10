import { NetState } from "../utils/online";

interface NetStatusProps {
  netState: NetState;
}

export default function NetStatus({ netState }: NetStatusProps) {
  return (
    <>
      <div className="box">
        <span className="net-status badge">{netState.status}</span>
      </div>
    </>
  );
}
