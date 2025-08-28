const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div className="card-modern p-0 overflow-hidden relative z-1">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-tertiary/80">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.accessor} 
                  className={`px-6 py-4 text-left text-sm font-semibold text-dark-text-primary uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border-primary">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-dark-elevated rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.718 2.172M12 2.5a9.963 9.963 0 00-9 5.5c0 3.53 2.164 6.571 5.218 8.5.678.427 1.287.8 1.782 1.085A9.967 9.967 0 0012 19.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-dark-text-primary">No data available</p>
                      <p className="text-sm text-dark-text-secondary">There are no records to display at this time.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr 
                  key={item.id || index}
                  className="hover:bg-dark-elevated/50 transition-colors duration-200 group"
                >
                  {renderRow(item)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
