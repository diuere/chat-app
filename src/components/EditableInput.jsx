import { useCallback, useState } from 'react';
import { Input, InputGroup, Notification, toaster } from 'rsuite';
import CloseIcon from '@rsuite/icons/Close';
import EditIcon from '@rsuite/icons/Edit';
import CheckIcon from '@rsuite/icons/Check';

const EditableInput = ({
  defaultValue,
  onSave,
  label = null,
  placeholder = 'Write your value',
  emptyMsg = 'Input is empty',
  ...inputProps
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isEditable, setIsEditable] = useState(false);

  const handleChange = useCallback(value => setInputValue(value), []);

  const onEditClick = useCallback(() => {
    setIsEditable(!isEditable);
    setInputValue(defaultValue);
  }, [defaultValue, isEditable]);

  const onSaveClick = async () => {
    const trimmed = inputValue.trim();

    if(trimmed === '') {
      toaster.push(
        <Notification type="info" header="info">{emptyMsg}</Notification>,
        { placement: 'topStart', duration: 4000 }
      );
    }

    if(trimmed !== defaultValue) {
      await onSave(trimmed)
    }
  }

  return (
    <div>
      {label}
      <InputGroup>
        <Input
          {...inputProps}
          value={inputValue}
          placeholder={placeholder}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <InputGroup.Button onClick={onEditClick}>
          {isEditable ? <CloseIcon /> : <EditIcon />}
        </InputGroup.Button>
        {isEditable && (
          <InputGroup.Button onClick={onSaveClick} >
            <CheckIcon />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditableInput;
