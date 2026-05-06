export default function DateRangeFields({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <label className="ui-field">
        <span className="ui-label">Check-in</span>
        <input
          className="ui-control"
          type="date"
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          required
        />
      </label>
      <label className="ui-field">
        <span className="ui-label">Check-out</span>
        <input
          className="ui-control"
          type="date"
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
          required
        />
      </label>
    </div>
  )
}
