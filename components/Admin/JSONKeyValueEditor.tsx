import React, { useState, useMemo } from 'react';
import { Search, Save, X, Filter } from 'lucide-react';
import { Button } from '../UI/Button';

interface JSONKeyValueEditorProps {
    initialData: any;
    onApply: (updatedData: any) => void;
    onCancel: () => void;
}

export const JSONKeyValueEditor: React.FC<JSONKeyValueEditorProps> = ({ 
    initialData, 
    onApply, 
    onCancel 
}) => {
    // Flatten logic
    const flatten = (obj: any, prefix = ''): Record<string, string> => {
        let items: Record<string, string> = {};
        
        for (const key in obj) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const val = obj[key];
            
            if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
                Object.assign(items, flatten(val, fullKey));
            } else if (Array.isArray(val)) {
                val.forEach((item, index) => {
                    const arrayKey = `${fullKey}[${index}]`;
                    if (typeof item === 'object' && item !== null) {
                        Object.assign(items, flatten(item, arrayKey));
                    } else {
                        items[arrayKey] = String(item);
                    }
                });
            } else {
                items[fullKey] = val !== null && val !== undefined ? String(val) : '';
            }
        }
        
        return items;
    };

    // Unflatten logic
    const unflatten = (data: Record<string, string>): any => {
        const result: any = {};
        
        for (const path in data) {
            const keys = path.split(/[.[\]]+/).filter(Boolean);
            let current = result;
            
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const isLast = i === keys.length - 1;
                const nextKey = keys[i + 1];
                const isNextNumber = nextKey !== undefined && /^\d+$/.test(nextKey);
                
                if (isLast) {
                    // Try to parse as number or boolean if possible, otherwise keep as string
                    const val = data[path];
                    if (val === 'true') current[key] = true;
                    else if (val === 'false') current[key] = false;
                    else if (!isNaN(Number(val)) && val.trim() !== '') current[key] = Number(val);
                    else current[key] = val;
                } else {
                    if (!(key in current)) {
                        current[key] = isNextNumber ? [] : {};
                    }
                    current = current[key];
                }
            }
        }
        
        return result;
    };

    const [flatData, setFlatData] = useState<Record<string, string>>(() => flatten(initialData));
    const [searchTerm, setSearchTerm] = useState('');

    const filteredKeys = useMemo(() => {
        return Object.keys(flatData).filter(key => 
            key.toLowerCase().includes(searchTerm.toLowerCase()) || 
            flatData[key].toLowerCase().includes(searchTerm.toLowerCase())
        ).sort();
    }, [flatData, searchTerm]);

    const handleValueChange = (key: string, value: string) => {
        setFlatData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleApply = () => {
        const unflattened = unflatten(flatData);
        onApply(unflattened);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10">
                <div className="relative w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search keys or values..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm transition-all"
                    />
                </div>
                
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <Filter className="w-3 h-3" />
                    Showing {filteredKeys.length} of {Object.keys(flatData).length} items
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gray-50/30">
                {filteredKeys.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">No matches found for "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {filteredKeys.map(key => (
                            <div key={key} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all group">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-green-600 transition-colors">
                                    {key}
                                </label>
                                <textarea
                                    value={flatData[key]}
                                    onChange={(e) => handleValueChange(key, e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm font-medium resize-none min-h-[40px]"
                                    rows={Math.max(1, flatData[key].split('\n').length)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
                <Button variant="outline" onClick={onCancel} className="px-6">
                    <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleApply} className="px-8 shadow-lg shadow-green-100">
                    <Save className="w-4 h-4 mr-2" /> Apply Changes
                </Button>
            </div>
        </div>
    );
};
