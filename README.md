[![Badge for version for Visual Studio Code extension](https://vsmarketplacebadge.apphb.com/version/asurraa.sura-code-snippets.svg)](https://marketplace.visualstudio.com/items?itemName=asurraa.sura-code-snippets)

# Sura VScode Snippets

**`aRC`**

> Generate React Component

```tsx
import { FC, Fragment } from 'react'

export interface indexProps {}

export const index: FC<indexProps> = (props) => {
  return <Fragment></Fragment>
}
```

**`aRP`**

> Generate React Page

```tsx
import { Fragment } from 'react'

const index = () => {
  return <Fragment></Fragment>
}

export default index
```

**`aRG`**

> Generate CURD Page

```tsx
import { Fragment } from 'react'
import { Input, Tag } from 'antd'
import { AsurRaaModal } from '@asurraa/sura-ui-modal'
import { AsurRaaTable } from '@asurraa/sura-ui-table'
import type { AsurRaaColumnsProps } from '@asurraa/sura-ui-table'
import { Logger } from '@asurraa/sura-ui-utilities'
import {
  SuraController,
  useDefaultFormState,
  useFormCreateOrEdit,
} from '@src/components/hook-form-controller/sura-hook-form-controller'

import {
  useSuraEditableData,
  useSuraModal,
  useSuraPage,
} from '@src/hooks/sura-hook'
import { useForm } from 'react-hook-form'

import {
  ProductCategoryServiceInterface,
  useProductCategoryService,
} from '@src/services/product-category.service'

type PT = ProductCategoryServiceInterface

const TestPage = () => {
  const [page, setPage] = useSuraPage(1)
  const [openModal, setOpenModal] = useSuraModal(false)
  const { getAll, createOne, deleteOne, updateOne } =
    useProductCategoryService()
  const { data, isLoading, refresh, meta } = getAll({ page })
  const [editableData, setEditableData] = useSuraEditableData<PT>(undefined)
  const generateDefaultForm = useDefaultFormState(editableData)
  const generateCreateOrEdit = useFormCreateOrEdit(editableData)
  const { control, handleSubmit, reset } = useForm<PT>()

  const onSubmitCreate = (data: PT) => {
    const submitData: PT = data
    // * Execute create service
  }

  const onSubmitUpdate = (data: PT) => {
    const submitData: PT = data
    // * Execute edit service
  }

  const columns: Array<AsurRaaColumnsProps<PT>> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '100px',
    },
  ]

  const Modal = (
    <AsurRaaModal
      visible={openModal}
      onCancel={() => {
        reset()
        setOpenModal(false)
      }}
      title={'Create Product Category'}
      onOk={handleSubmit(generateCreateOrEdit(onSubmitCreate, onSubmitUpdate))}
    >
      <form style={{ margin: 10 }}>
        <SuraController
          titleHeader={'Name'}
          name="name"
          control={control}
          defaultValue={generateDefaultForm('name')}
          render={({ field }) => {
            return (
              <div>
                <Input {...field} />
              </div>
            )
          }}
        />
      </form>
    </AsurRaaModal>
  )

  return (
    <Fragment>
      {Modal}
      <AsurRaaTable
        antdTableProps={{
          bordered: true,
          loading: isLoading,
          pagination: {
            pageSize: 10,
            total: meta?.totalItems,
            current: page,
            onChange: (page) => setPage(page),
          },
        }}
        data={data}
        asurRaaColumnProps={columns}
        refreshButton={{
          onClick: () => {
            refresh()
          },
        }}
        createButton={{
          onClick: () => {
            //* Create
            setEditableData(undefined)
            setOpenModal(true)
          },
        }}
        editActionButton={(propsData) => ({
          onClick: () => {
            //* Perform update | Edit
            setEditableData(propsData)
            setOpenModal(true)
          },
        })}
        deleteActionButton={(propsData) => ({
          onOk: () => {
            //*  Delete
          },
        })}
        dataAllCSV={data}
      />
    </Fragment>
  )
}

export default TestPage
```
