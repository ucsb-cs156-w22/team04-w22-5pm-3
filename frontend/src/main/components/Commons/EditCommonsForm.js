import React, {useState} from 'react'
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom'

//export default function EditCommonsForm(props) {
export default function EditCommonsForm({ initialCommons, submitAction }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(
    { defaultValues: initialCommons || {}, }
  );

  const navigate = useNavigate();

  return (

   <Form onSubmit={handleSubmit(submitAction)}>

      {initialCommons && (
        <Form.Group className="mb-3" >
          <Form.Label htmlFor="id">Id</Form.Label>
            <Form.Control
              data-testid="CommonsForm-id"
              id="id"
              type="text"
              {...register("id")}
              value={initialCommons.id}
              disabled
            />
        </Form.Group>
      )}

        <Form.Group className="mb-3" >
          <Form.Label htmlFor="Name">Name</Form.Label>
          <Form.Control
            data-testid="CommonsForm-name"
            id="name"
            type="text"
            isInvalid={Boolean(errors.name)}
            {...register("name", {
               required: "Name is required."
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.data?.message}
          </Form.Control.Feedback>
        </Form.Group>

      {/* <Form.Group className="mb-3">
        <Form.Label htmlFor="name">Commons Name</Form.Label>
        <Form.Control
          id="name"
          type="text"
          isInvalid={!!errors.name}
          {...register("name", { required: "Commons name is required" })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group> */}
 { /*
  //     <Form.Group className="mb-3">
  //       <Form.Label htmlFor="startingBalance">Starting Balance</Form.Label>
  //       <Form.Control
  //         id="startingBalance"
  //         type="number"
  //         step="0.01"
  //         isInvalid={!!errors.startingBalance}
  //         {...register("startingBalance", {
  //           valueAsNumber: true,
  //           required: "Starting Balance is required",
  //           min: { value: 0.01, message: "Starting Balance must be positive" },
  //         })}
  //       />
  //       <Form.Control.Feedback type="invalid">
  //         {errors.startingBalance?.message}
  //       </Form.Control.Feedback>
  //     </Form.Group>

  //     <Form.Group className="mb-3">
  //       <Form.Label htmlFor="cowPrice">Cow Price</Form.Label>
  //       <Form.Control
  //         id="cowPrice"
  //         type="number"
  //         step="0.01"
  //         isInvalid={!!errors.cowPrice}
  //         {...register("cowPrice", {
  //           valueAsNumber: true,
  //           required: "Cow price is required",
  //           min: { value: 0.01, message: "Cow price must be positive" },
  //         })}
  //       />
  //       <Form.Control.Feedback type="invalid">
  //         {errors.cowPrice?.message}
  //       </Form.Control.Feedback>
  //     </Form.Group>

  //     <Form.Group className="mb-3">
  //       <Form.Label htmlFor="milkPrice">Milk Price</Form.Label>
  //       <Form.Control
  //         id="milkPrice"
  //         type="number"
  //         step="0.01"
  //         isInvalid={!!errors.milkPrice}
  //         {...register("milkPrice", {
  //           valueAsNumber: true,
  //           required: "Milk price is required",
  //           min: { value: 0.01, message: "Milk price must be positive" },
  //         })}
  //       />
  //       <Form.Control.Feedback type="invalid">
  //         {errors.milkPrice?.message}
  //       </Form.Control.Feedback>
  //     </Form.Group>

  //     <Form.Group className="mb-3">
  //       <Form.Label htmlFor="startDate">Start Date</Form.Label>
  //       <Form.Control
  //         id="startDate"
  //         type="date"
  //         isInvalid={!!errors.startDate}
  //         {...register("startDate", {
  //           valueAsDate: true,
  //           validate: {
  //             isPresent: (v) => !isNaN(v) || "Start date is required",
  //           },
  //         })}
  //       />
  //       <Form.Control.Feedback type="invalid">
  //         {errors.startDate?.message}
  //       </Form.Control.Feedback>
  //     </Form.Group>
  */ }
      <Button 
      type="submit" 
      data-testid="CommonsForm-Edit"
      >
        Edit
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid="CommonsForm-cancel"
      >
        Cancel
      </Button>
    </Form>
  );
}
