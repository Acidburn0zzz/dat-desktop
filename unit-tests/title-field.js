import test from 'tape'
import React from 'react'
import { shallow } from 'enzyme'
import TitleField from '../app/components/title-field'
import {
  Plain as PlainButton,
  Green as GreenButton
} from '../app/components/button'
import Icon from '../app/components/icon'

test('title field show not be editable if dat is not writable', t => {
  const wrapper = shallow(
    <TitleField
      dat={{
        writable: false,
        metadata: {
          title: 'A-title'
        }
      }}
      titleEditInPlace={{
        isEditing: false,
        editValue: ''
      }}
    />
  )

  t.equal(wrapper.find(PlainButton).length, 0)
  t.equal(wrapper.find(GreenButton).length, 0)

  t.end()
})

test('title field show edit button if dat is editable and is not editing', t => {
  const wrapper = shallow(
    <TitleField
      dat={{
        writable: true,
        metadata: {
          title: 'A-title'
        }
      }}
      titleEditInPlace={{
        isEditing: false,
        editValue: ''
      }}
    />
  )

  t.equal(wrapper.find(Icon).length, 1)

  t.end()
})

test('title field show plain button if title value is equal to input field value when editing', t => {
  const wrapper = shallow(
    <TitleField
      dat={{
        writable: true,
        metadata: {
          title: 'A-title'
        }
      }}
      titleEditInPlace={{
        isEditing: true,
        editValue: 'A-title'
      }}
    />
  )

  t.equal(wrapper.find(PlainButton).length, 1)
  t.equal(wrapper.find(GreenButton).length, 0)

  t.end()
})

test('title field show green button if title value is not equal to input field value when editing', t => {
  const wrapper = shallow(
    <TitleField
      dat={{
        writable: true,
        metadata: {
          title: 'A-title'
        }
      }}
      titleEditInPlace={{
        isEditing: true,
        editValue: 'beep'
      }}
    />
  )

  t.equal(wrapper.find(PlainButton).length, 0)
  t.equal(wrapper.find(GreenButton).length, 1)

  t.end()
})
