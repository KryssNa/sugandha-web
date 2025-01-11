'use client';

import { IScentNote } from '@/components/shared/types/productTypes';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Plus,
    RefreshCw,
    Trash2
} from 'lucide-react';
import React, { useState } from 'react';


interface ScentNotesSectionProps {
    scentNotesManager: {
        scentNotes: IScentNote[];
        loading: boolean;
        actions: {
            addScentNote: (type: string, notes: string[]) => Promise<boolean>;
            updateScentNotes: (type: string, notes: string[]) => Promise<boolean>;
            deleteScentNote: (type: string) => Promise<boolean>;
            fetchScentNotes?: () => Promise<void>;
            reorderNotes?: (type: string, newOrder: string[]) => Promise<boolean>;
            validateScentNotes?: (notes: IScentNote[]) => string[];
        };
    };
}

const scentNoteTypes = ['top', 'middle', 'base'] as const;

const ScentNotesSection: React.FC<ScentNotesSectionProps> = ({
    scentNotesManager
}) => {
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNote, setNewNote] = useState<{
        type: typeof scentNoteTypes[number];
        notes: string[];
    }>({
        type: 'top',
        notes: ['']
    });

    const handleAddNote = async () => {
        // Validate note data
        if (!newNote.type || newNote.notes.some(note => !note.trim())) {
            alert('Please fill in all scent note details');
            return;
        }

        try {
            const success = await scentNotesManager.actions.addScentNote(
                newNote.type,
                newNote.notes
            );

            if (success) {
                // Reset form
                setNewNote({
                    type: 'top',
                    notes: ['']
                });
                setIsAddingNote(false);
            }
        } catch (error) {
            console.error('Failed to add scent note', error);
            alert('Failed to add scent note. Please try again.');
        }
    };

    const handleAddNoteInput = () => {
        setNewNote(prev => ({
            ...prev,
            notes: [...prev.notes, '']
        }));
    };

    const handleNoteInputChange = (index: number, value: string) => {
        setNewNote(prev => ({
            ...prev,
            notes: prev.notes.map((note, i) => i === index ? value : note)
        }));
    };

    const handleRemoveNoteInput = (index: number) => {
        setNewNote(prev => ({
            ...prev,
            notes: prev.notes.filter((_, i) => i !== index)
        }));
    };

    const handleRemoveScentNote = async (type: string) => {
        try {
            const success = await scentNotesManager.actions.deleteScentNote(type);
            if (!success) {
                alert('Failed to remove scent note');
            }
        } catch (error) {
            console.error('Error removing scent note', error);
            alert('Failed to remove scent note');
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Scent Notes</h2>
                <button
                    type="button"
                    onClick={() => setIsAddingNote(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg 
            hover:bg-orange-100 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Scent Note
                </button>
            </div>

            {/* Add Scent Note Form */}
            <AnimatePresence>
                {isAddingNote && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 overflow-hidden"
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Note Type
                            </label>
                            <select
                                value={newNote.type}
                                onChange={(e) => setNewNote(prev => ({
                                    ...prev,
                                    type: e.target.value as typeof scentNoteTypes[number]
                                }))}
                                className="w-full rounded-md border-gray-300"
                            >
                                {scentNoteTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)} Notes
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            {newNote.notes.map((note, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => handleNoteInputChange(index, e.target.value)}
                                        className="flex-1 rounded-md border-gray-300"
                                        placeholder={`Enter ${newNote.type} note`}
                                    />
                                    {newNote.notes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNoteInput(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <button
                                type="button"
                                onClick={handleAddNoteInput}
                                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-800"
                            >
                                <Plus className="w-4 h-4" />
                                Add Another Note
                            </button>
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingNote(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddNote}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                >
                                    Add Scent Note
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scent Notes List */}
            {scentNotesManager.scentNotes.length > 0 ? (
                <div className="space-y-4">
                    {scentNotesManager.scentNotes.map((scentNote, index) => (
                        <motion.div
                            key={`${scentNote.type}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-800 capitalize">
                                    {scentNote.type} Notes
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveScentNote(scentNote.type)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <ul className="list-disc list-inside text-gray-600">
                                {scentNote.notes.map((note, noteIndex) => (
                                    <li key={noteIndex}>{note}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-4">
                    <RefreshCw className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No scent notes added yet. Click "Add Scent Note" to get started.</p>
                </div>
            )}
        </div>
    );
};

export default ScentNotesSection;